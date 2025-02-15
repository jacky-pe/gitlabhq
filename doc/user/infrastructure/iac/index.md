---
stage: Deploy
group: Environments
info: To determine the technical writer assigned to the Stage/Group associated with this page, see https://about.gitlab.com/handbook/product/ux/technical-writing/#assignments
---

# Infrastructure as Code with Terraform and GitLab **(FREE)**

To manage your infrastructure with GitLab, you can use the integration with
Terraform to define resources that you can version, reuse, and share:

- Manage low-level components like compute, storage, and networking resources.
- Manage high-level components like DNS entries and SaaS features.
- Incorporate GitOps deployments and Infrastructure-as-Code (IaC) workflows.
- Use GitLab as a Terraform state storage.
- Store and use Terraform modules to simplify common and complex infrastructure patterns.

<i class="fa fa-youtube-play youtube" aria-hidden="true"></i> Watch [a video overview](https://www.youtube.com/watch?v=iGXjUrkkzDI) of the features GitLab provides with the integration with Terraform.

## Integrate your project with Terraform

> IaC Scanning was [introduced](https://gitlab.com/groups/gitlab-org/-/epics/6655) in GitLab 14.6.

The integration with GitLab and Terraform happens through GitLab CI/CD.
Use an `include` attribute to add the Terraform template to your project and
customize from there.

To get started, choose the template that best suits your needs:

- [Latest template](#latest-terraform-template)
- [Stable template and advanced template](#stable-and-advanced-terraform-templates)

All templates:

- Use the [GitLab-managed Terraform state](terraform_state.md) as the Terraform state storage backend.
- Trigger four pipeline stages: `test`, `validate`, `build`, and `deploy`.
- Run Terraform commands: `test`, `validate`, `plan`, and `plan-json`. It also runs the `apply` only on the default branch.
- Check for security problems using [IaC Scanning](../../application_security/iac_scanning/index.md#configure-iac-scanning-manually).

### Latest Terraform template

The [latest template](https://gitlab.com/gitlab-org/gitlab/-/blob/master/lib/gitlab/ci/templates/Terraform.latest.gitlab-ci.yml)
is compatible with the most recent GitLab version. It provides the most recent
GitLab features, but can potentially include breaking changes.

You can safely use the latest Terraform template:

- If you use GitLab.com.
- If you use a self-managed instance updated with every new GitLab release.

### Stable and advanced Terraform templates

If you use earlier versions of GitLab, you might face incompatibility errors
between the GitLab version and the template version. In this case, you can opt
to use one of these templates:

- [The stable template](https://gitlab.com/gitlab-org/gitlab/-/blob/master/lib/gitlab/ci/templates/Terraform.gitlab-ci.yml) with a skeleton that you can built on top of.
- [The advanced template](https://gitlab.com/gitlab-org/gitlab/-/blob/master/lib/gitlab/ci/templates/Terraform/Base.gitlab-ci.yml) to fully customize your setup.

NOTE:
In each GitLab major release (for example, 15.0), the latest templates replace the older ones. This process can introduce breaking changes. You can [use an older version of the template](troubleshooting.md#use-an-older-version-of-the-template) if you need to.

### Use a Terraform template

To use a Terraform template:

1. On the left sidebar, at the top, select **Search GitLab** (**{search}**) to find your project you want to integrate with Terraform.
1. Select **Code > Repository**.
1. Edit your `.gitlab-ci.yml` file, use the `include` attribute to fetch the Terraform template:

   ```yaml
   include:
    # To fetch the latest template, use:
     - template: Terraform.latest.gitlab-ci.yml
    # To fetch the advanced latest template, use:
     - template: Terraform/Base.latest.gitlab-ci.yml
    # To fetch the stable template, use:
     - template: Terraform.gitlab-ci.yml
    # To fetch the advanced stable template, use:
     - template: Terraform/Base.gitlab-ci.yml
   ```

1. Add the variables as described below:

   ```yaml
   variables:
    TF_STATE_NAME: default
    TF_CACHE_KEY: default
    # If your terraform files are in a subdirectory, set TF_ROOT accordingly. For example:
    # TF_ROOT: terraform/production
   ```

1. Optional. Override in your `.gitlab-ci.yml` file the attributes present
in the template you fetched to customize your configuration.

### Terraform template recipes

For GitLab-curated template recipes, see [Terraform template recipes](terraform_template_recipes.md).

## Related topics

- View [the images that contain the `gitlab-terraform` shell script](https://gitlab.com/gitlab-org/terraform-images).
- Use GitLab as a [Terraform Module Registry](../../packages/terraform_module_registry/index.md).
- To store state files in local storage or in a remote store, use the [GitLab-managed Terraform state](terraform_state.md).
- To collaborate on Terraform code changes and Infrastructure-as-Code workflows, use the
  [Terraform integration in merge requests](mr_integration.md).
- To manage GitLab resources like users, groups, and projects, use the
  [GitLab Terraform provider](https://gitlab.com/gitlab-org/terraform-provider-gitlab).
  The GitLab Terraform provider documentation is available on [the Terraform docs site](https://registry.terraform.io/providers/gitlabhq/gitlab/latest/docs).
- [Create a new cluster on Amazon Elastic Kubernetes Service (EKS)](../clusters/connect/new_eks_cluster.md).
- [Create a new cluster on Google Kubernetes Engine (GKE)](../clusters/connect/new_gke_cluster.md).
- [Troubleshoot](troubleshooting.md) issues with GitLab and Terraform.
