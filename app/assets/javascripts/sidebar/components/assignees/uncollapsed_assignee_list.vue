<script>
import glFeatureFlagsMixin from '~/vue_shared/mixins/gl_feature_flags_mixin';
import { TYPE_ISSUE, TYPE_MERGE_REQUEST } from '~/issues/constants';
import { __, sprintf } from '~/locale';
import AssigneeAvatarLink from './assignee_avatar_link.vue';
import UserNameWithStatus from './user_name_with_status.vue';

const DEFAULT_RENDER_COUNT = 5;

export default {
  components: {
    AssigneeAvatarLink,
    UserNameWithStatus,
  },
  mixins: [glFeatureFlagsMixin()],
  props: {
    users: {
      type: Array,
      required: true,
    },
    issuableType: {
      type: String,
      required: false,
      default: TYPE_ISSUE,
    },
  },
  data() {
    return {
      showLess: true,
    };
  },
  computed: {
    firstUser() {
      return this.users[0];
    },
    hiddenAssigneesLabel() {
      const { numberOfHiddenAssignees } = this;
      return sprintf(__('+ %{numberOfHiddenAssignees} more'), { numberOfHiddenAssignees });
    },
    renderShowMoreSection() {
      return this.users.length > DEFAULT_RENDER_COUNT;
    },
    numberOfHiddenAssignees() {
      return this.users.length - DEFAULT_RENDER_COUNT;
    },
    uncollapsedUsers() {
      const uncollapsedLength = this.showLess
        ? Math.min(this.users.length, DEFAULT_RENDER_COUNT)
        : this.users.length;
      return this.showLess ? this.users.slice(0, uncollapsedLength) : this.users;
    },
    username() {
      return `@${this.firstUser.username}`;
    },
    isMergeRequest() {
      return this.issuableType === TYPE_MERGE_REQUEST;
    },
  },
  methods: {
    toggleShowLess() {
      this.showLess = !this.showLess;
    },
    userAvailability(u) {
      if (this.issuableType === TYPE_MERGE_REQUEST) {
        return u?.availability || '';
      }
      return u?.status?.availability || '';
    },
  },
};
</script>

<template>
  <div>
    <div class="gl-display-flex gl-flex-wrap">
      <div
        v-for="(user, index) in uncollapsedUsers"
        :key="user.id"
        :class="{
          'gl-mb-3': index !== users.length - 1 || users.length > 5,
        }"
        class="assignee-grid gl-display-grid gl-align-items-center gl-w-full"
      >
        <assignee-avatar-link
          :user="user"
          :issuable-type="issuableType"
          :tooltip-has-name="!isMergeRequest"
          class="gl-word-break-word"
          data-css-area="user"
        >
          <div
            class="gl-ml-3 gl-line-height-normal gl-display-grid gl-align-items-center"
            data-testid="username"
            data-qa-selector="username"
          >
            <user-name-with-status :name="user.name" :availability="userAvailability(user)" />
          </div>
        </assignee-avatar-link>
      </div>
    </div>
    <div v-if="renderShowMoreSection" class="user-list-more gl-hover-text-blue-800">
      <button
        type="button"
        class="btn-link gl-button gl-reset-color!"
        data-qa-selector="more_assignees_link"
        @click="toggleShowLess"
      >
        <template v-if="showLess">
          {{ hiddenAssigneesLabel }}
        </template>
        <template v-else>{{ __('- show less') }}</template>
      </button>
    </div>
  </div>
</template>
