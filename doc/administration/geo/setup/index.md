---
stage: Systems
group: Geo
info: To determine the technical writer assigned to the Stage/Group associated with this page, see https://about.gitlab.com/handbook/product/ux/technical-writing/#assignments
type: howto
---

# Setting up Geo **(PREMIUM SELF)**

## Prerequisites

- Two (or more) independently working GitLab sites:
  - One GitLab site serves as the Geo **primary** site. Use the [GitLab reference architectures documentation](../../reference_architectures/index.md) to set this up. You can use different reference architecture sizes for each Geo site. If you already have a working GitLab instance that is in-use, it can be used as a **primary** site.
  - The second GitLab site serves as the Geo **secondary** site. Use the [GitLab reference architectures documentation](../../reference_architectures/index.md) to set this up. It's a good idea to sign in and test it. However, be aware that **all of the data on the secondary are lost** as part of the process of replicating from the **primary** site.

  NOTE:
  Geo supports multiple secondaries. You can follow the same steps and make any changes accordingly.

- Ensure the **primary** site has a [GitLab Premium or Ultimate](https://about.gitlab.com/pricing/) subscription to unlock Geo. You only need one license for all the sites.
- Confirm the [requirements for running Geo](../index.md#requirements-for-running-geo) are met by all sites. For example, sites must use the same GitLab version, and sites must be able to communicate with each other over certain ports.
- Confirm the **primary** and **secondary** site storage configurations match. If the primary Geo site uses object storage, the secondary Geo site must use it too. For more information, see [Geo with Object storage](../replication/object_storage.md).
- Ensure clocks are synchronized between the **primary** site and the **secondary** site. Synchronized clocks are required for Geo to function correctly. For example, if the clock drift between the **primary** and **secondary** sites exceeds 1 minute, replication fails.

## Using Linux package installations

If you installed GitLab using the Linux package (highly recommended), the process for setting up Geo depends on whether you need to set up
a single-node Geo site or a multi-node Geo site.

### Single-node Geo sites

If both Geo sites are based on the [1K reference architecture](../../reference_architectures/1k_users.md):

1. Set up the database replication based on your choice of PostgreSQL instances (`primary (read-write) <-> secondary (read-only)` topology):
   - [Using Linux package PostgreSQL instances](database.md) .
   - [Using external PostgreSQL instances](external_database.md)
1. [Configure GitLab](../replication/configuration.md) to set the **primary** and **secondary** sites.
1. Recommended: [Configure unified URLs](../secondary_proxy/index.md#set-up-a-unified-url-for-geo-sites) to use a single, unified URL for all Geo sites.
1. Optional: [Configure Object storage replication](../replication/object_storage.md)
1. Optional: [Configure a secondary LDAP server](../../auth/ldap/index.md) for the **secondary** sites. See [notes on LDAP](../index.md#ldap).
1. Optional: [Configure Container Registry for the secondary site](../replication/container_registry.md).
1. Follow the [Using a Geo Site](../replication/usage.md) guide.

### Multi-node Geo sites

If one or more of your sites is using the [2K reference architecture](../../reference_architectures/2k_users.md) or larger, see
[Configure Geo for multiple nodes](../replication/multiple_servers.md).

## Using GitLab Charts

[Configure the GitLab chart with GitLab Geo](https://docs.gitlab.com/charts/advanced/geo/).

## Geo and self-compiled installations

Geo is not supported when you use a [self-compiled GitLab installation](../../../install/installation.md).

## Post-installation documentation

After installing GitLab on the **secondary** sites and performing the initial configuration, see the [following documentation for post-installation information](../index.md#post-installation-documentation).
