<script>
import { GlIcon, GlTooltipDirective } from '@gitlab/ui';
import { formatTime } from '~/lib/utils/datetime_utility';
import timeagoMixin from '~/vue_shared/mixins/timeago';

export default {
  directives: {
    GlTooltip: GlTooltipDirective,
  },
  components: { GlIcon },
  mixins: [timeagoMixin],
  props: {
    pipeline: {
      type: Object,
      required: true,
    },
    displayCalendarIcon: {
      type: Boolean,
      required: false,
      default: true,
    },
    fontSize: {
      type: String,
      required: false,
      default: 'gl-font-sm',
      validator: (fontSize) => ['gl-font-sm', 'gl-font-md'].includes(fontSize),
    },
  },
  computed: {
    duration() {
      return this.pipeline?.details?.duration;
    },
    durationFormatted() {
      return formatTime(this.duration * 1000);
    },
    finishedTime() {
      return this.pipeline?.details?.finished_at || this.pipeline?.finishedAt;
    },
  },
};
</script>
<template>
  <div
    class="gl-display-flex gl-flex-direction-column gl-align-items-flex-end gl-lg-align-items-flex-start"
    :class="fontSize"
  >
    <p v-if="duration" class="duration gl-display-inline-flex gl-align-items-center">
      <gl-icon name="timer" class="gl-mr-2" :size="12" />
      {{ durationFormatted }}
    </p>

    <p v-if="finishedTime" class="finished-at gl-display-inline-flex gl-align-items-center">
      <gl-icon
        v-if="displayCalendarIcon"
        name="calendar"
        class="gl-mr-2"
        :size="12"
        data-testid="calendar-icon"
      />

      <time
        v-gl-tooltip
        :title="tooltipTitle(finishedTime)"
        :datetime="finishedTime"
        data-placement="top"
        data-container="body"
      >
        {{ timeFormatted(finishedTime) }}
      </time>
    </p>
  </div>
</template>
