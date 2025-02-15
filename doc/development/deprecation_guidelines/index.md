---
stage: none
group: unassigned
info: To determine the technical writer assigned to the Stage/Group associated with this page, see https://about.gitlab.com/handbook/product/ux/technical-writing/#assignments
---

# Deprecating GitLab features

This page includes information about how and when to remove or make breaking changes
to GitLab features.

For details about the terms used on this page, see [the terminology](../../update/terminology.md).

## When can a feature be deprecated?

Deprecations should be announced on the [Deprecated feature removal schedule](../../update/deprecations.md).

Deprecations should be announced [no later than the third milestone preceding intended removal](https://about.gitlab.com/handbook/product/gitlab-the-product/#process-for-deprecating-and-removing-a-feature).

Do not include the deprecation announcement in the merge request that introduces a code change for the deprecation.
Use a separate MR to create a deprecation entry. For steps to create a deprecation entry, see
[Deprecations](https://about.gitlab.com/handbook/marketing/blog/release-posts/#deprecations).

![Deprecation, End of Support, Removal process](img/deprecation_removal_process.png)

## How are Community Contributions to a deprecated feature handled?

Development on deprecated features is restricted to Priority 1 / Severity 1 bug fixes. Any community contributions to deprecated features are unlikely to be prioritized during milestone planning.

However, at GitLab, we [give agency](https://about.gitlab.com/handbook/values/#give-agency) to our team members. So, a member of the team associated with the contribution may decide to review and merge it at their discretion.

## When can a feature be removed/changed?

Generally, feature or configuration can be removed/changed only on major release.
It also should be [deprecated in advance](https://about.gitlab.com/handbook/marketing/blog/release-posts/#deprecations).

For API removals, see the [GraphQL](../../api/graphql/index.md#deprecation-and-removal-process) and [GitLab API](../documentation/restful_api_styleguide.md#deprecations) guidelines.

For configuration removals, see the [Omnibus deprecation policy](../../administration/package_information/deprecation_policy.md).

For versioning and upgrade details, see our [Release and Maintenance policy](../../policy/maintenance.md).

## Update the deprecations documentation pages

The [deprecations](../../update/deprecations.md)
documentation is generated from the YAML files located in
[`gitlab/data/`](https://gitlab.com/gitlab-org/gitlab/-/tree/master/data).

To update the deprecations page when an entry is added,
edited, or removed:

1. From the command line, navigate to your local clone of the [`gitlab-org/gitlab`](https://gitlab.com/gitlab-org/gitlab) project.
1. Create, edit, or remove the YAML file under [`data/deprecations`](https://gitlab.com/gitlab-org/gitlab/-/tree/master/data/deprecations).
1. Compile the deprecation documentation:

   ```shell
   bin/rake gitlab:docs:compile_deprecations
   ```

1. If needed, you can verify the docs are up to date with:

   ```shell
   bin/rake gitlab:docs:check_deprecations
   ```

1. Commit the updated documentation and push the changes.
1. Create a merge request using the [Deprecations](https://gitlab.com/gitlab-org/gitlab/-/blob/master/.gitlab/merge_request_templates/Deprecations.md)
   template.

Related Handbook pages:

- <https://about.gitlab.com/handbook/marketing/blog/release-posts/#deprecations-removals-and-breaking-changes>
- <https://about.gitlab.com/handbook/marketing/blog/release-posts/#update-the-deprecations-and-removals-docs>

## Update the related documentation

When features are deprecated and removed, [update the related documentation](../documentation/versions.md#deprecations-and-removals).
