<script>
import { GlButton, GlTooltipDirective } from '@gitlab/ui';
import runnerTogglePausedMutation from '~/ci/runner/graphql/shared/runner_toggle_paused.mutation.graphql';
import { createAlert } from '~/alert';
import { captureException } from '~/ci/runner/sentry_utils';
import { I18N_PAUSE, I18N_PAUSE_TOOLTIP, I18N_RESUME, I18N_RESUME_TOOLTIP } from '../constants';

export default {
  name: 'RunnerPauseButton',
  components: {
    GlButton,
  },
  directives: {
    GlTooltip: GlTooltipDirective,
  },
  props: {
    runner: {
      type: Object,
      required: true,
    },
    compact: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['toggledPaused'],
  data() {
    return {
      updating: false,
    };
  },
  computed: {
    isPaused() {
      return this.runner.paused;
    },
    icon() {
      return this.isPaused ? 'play' : 'pause';
    },
    label() {
      return this.isPaused ? I18N_RESUME : I18N_PAUSE;
    },
    buttonContent() {
      if (this.compact) {
        return null;
      }
      return this.label;
    },
    ariaLabel() {
      if (this.compact) {
        return this.label;
      }
      return null;
    },
    tooltip() {
      // Prevent a "sticky" tooltip: If this button is disabled,
      // mouseout listeners don't run leaving the tooltip stuck
      if (!this.updating) {
        return this.isPaused ? I18N_RESUME_TOOLTIP : I18N_PAUSE_TOOLTIP;
      }
      return '';
    },
  },
  methods: {
    async onToggle() {
      this.updating = true;
      try {
        const input = {
          id: this.runner.id,
          paused: !this.isPaused,
        };

        const {
          data: {
            runnerUpdate: { errors },
          },
        } = await this.$apollo.mutate({
          mutation: runnerTogglePausedMutation,
          variables: {
            input,
          },
        });

        if (errors && errors.length) {
          throw new Error(errors.join(' '));
        }
        this.$emit('toggledPaused');
      } catch (e) {
        this.onError(e);
      } finally {
        this.updating = false;
      }
    },
    onError(error) {
      const { message } = error;

      createAlert({ message });
      captureException({ error, component: this.$options.name });
    },
  },
};
</script>

<template>
  <gl-button
    v-gl-tooltip="tooltip"
    v-bind="$attrs"
    :aria-label="ariaLabel"
    :icon="icon"
    :loading="updating"
    @click="onToggle"
    v-on="$listeners"
  >
    <!--
      Use <template v-if> to ensure a square button is shown when compact: true.
      Sending empty content will still show a distorted/rectangular button.
    -->
    <template v-if="buttonContent">{{ buttonContent }}</template>
  </gl-button>
</template>
