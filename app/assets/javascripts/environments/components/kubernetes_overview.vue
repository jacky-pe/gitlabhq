<script>
import { GlCollapse, GlButton, GlAlert } from '@gitlab/ui';
import { __, s__ } from '~/locale';
import csrf from '~/lib/utils/csrf';
import { getIdFromGraphQLId } from '~/graphql_shared/utils';
import KubernetesAgentInfo from './kubernetes_agent_info.vue';
import KubernetesPods from './kubernetes_pods.vue';
import KubernetesTabs from './kubernetes_tabs.vue';
import KubernetesStatusBar from './kubernetes_status_bar.vue';

export default {
  components: {
    GlCollapse,
    GlButton,
    GlAlert,
    KubernetesAgentInfo,
    KubernetesPods,
    KubernetesTabs,
    KubernetesStatusBar,
  },
  inject: ['kasTunnelUrl'],
  props: {
    clusterAgent: {
      required: true,
      type: Object,
    },
    namespace: {
      required: false,
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isVisible: false,
      error: '',
      hasFailedState: false,
      podsLoading: false,
      workloadTypesLoading: false,
    };
  },
  computed: {
    chevronIcon() {
      return this.isVisible ? 'chevron-down' : 'chevron-right';
    },
    label() {
      return this.isVisible ? this.$options.i18n.collapse : this.$options.i18n.expand;
    },
    gitlabAgentId() {
      return getIdFromGraphQLId(this.clusterAgent.id).toString();
    },
    k8sAccessConfiguration() {
      return {
        basePath: this.kasTunnelUrl,
        baseOptions: {
          headers: { 'GitLab-Agent-Id': this.gitlabAgentId, ...csrf.headers },
          withCredentials: true,
        },
      };
    },
    clusterHealthStatus() {
      const clusterDataLoading = this.podsLoading || this.workloadTypesLoading;
      if (clusterDataLoading) {
        return '';
      }

      return this.hasFailedState ? 'error' : 'success';
    },
  },
  methods: {
    toggleCollapse() {
      this.isVisible = !this.isVisible;
    },
    onClusterError(message) {
      this.error = message;
    },
  },
  i18n: {
    collapse: __('Collapse'),
    expand: __('Expand'),
    sectionTitle: s__('Environment|Kubernetes overview'),
  },
};
</script>
<template>
  <div class="gl-px-4">
    <p class="gl-font-weight-bold gl-text-gray-500 gl-display-flex gl-mb-0">
      <gl-button
        :icon="chevronIcon"
        :aria-label="label"
        category="tertiary"
        size="small"
        class="gl-mr-3"
        @click="toggleCollapse"
      />{{ $options.i18n.sectionTitle }}
    </p>
    <gl-collapse :visible="isVisible" class="gl-md-pl-7 gl-md-pr-5 gl-mt-4">
      <template v-if="isVisible">
        <kubernetes-status-bar :cluster-health-status="clusterHealthStatus" class="gl-mb-4" />
        <kubernetes-agent-info :cluster-agent="clusterAgent" class="gl-mb-5" />

        <gl-alert v-if="error" variant="danger" :dismissible="false" class="gl-mb-5">
          {{ error }}
        </gl-alert>

        <kubernetes-pods
          :configuration="k8sAccessConfiguration"
          :namespace="namespace"
          class="gl-mb-5"
          @cluster-error="onClusterError"
          @loading="podsLoading = $event"
          @failed="hasFailedState = true" />
        <kubernetes-tabs
          :configuration="k8sAccessConfiguration"
          :namespace="namespace"
          class="gl-mb-5"
          @cluster-error="onClusterError"
          @loading="workloadTypesLoading = $event"
          @failed="hasFailedState = true"
      /></template>
    </gl-collapse>
  </div>
</template>
