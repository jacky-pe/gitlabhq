---
stage: Manage
group: Authentication and Authorization
info: To determine the technical writer assigned to the Stage/Group associated with this page, see https://about.gitlab.com/handbook/product/ux/technical-writing/#assignments
type: howto
---

# Locked users **(FREE SELF)**

## Self-managed users

Users are locked after ten failed sign-in attempts. These users remain locked:

- For 10 minutes, after which time they are automatically unlocked.
- Until an administrator unlocks them from the [Admin Area](../user/admin_area/index.md) or the command line in under 10 minutes.

## GitLab.com users

If 2FA is not enabled users are locked after three failed sign-in attempts within 24 hours. These users remain locked until:

- Their next successful sign-in, at which point they are sent an email with a six-digit unlock code and redirected to a verification page where they can unlock their account by entering the code.
- GitLab Support [manually unlock](https://about.gitlab.com/handbook/support/workflows/reinstating-blocked-accounts.html#manual-unlock) the account after account ownership is verified.

If 2FA is enabled, users are locked after five failed sign-in attempts within 10 minutes. Accounts are unlocked automatically after 10 minutes.

## Unlock a user from the Admin Area

1. On the left sidebar, expand the top-most chevron (**{chevron-down}**).
1. Select **Admin Area**.
1. On the left sidebar, select **Overview > Users**.
1. Use the search bar to find the locked user.
1. From the **User administration** dropdown list, select **Unlock**.

## Unlock a user from the command line

To unlock a locked user:

1. SSH into your GitLab server.
1. Start a Ruby on Rails console:

   ```shell
   ## For Omnibus GitLab
   sudo gitlab-rails console -e production

   ## For installations from source
   sudo -u git -H bundle exec rails console -e production
   ```

1. Find the user to unlock. You can search by email or ID.

   ```ruby
   user = User.find_by(email: 'admin@local.host')
   ```

   or

   ```ruby
   user = User.where(id: 1).first
   ```

1. Unlock the user:

   ```ruby
   user.unlock_access!
   ```

1. Exit the console with <kbd>Control</kbd>+<kbd>d</kbd>

The user should now be able to sign in.

<!-- ## Troubleshooting

Include any troubleshooting steps that you can foresee. If you know beforehand what issues
one might have when setting this up, or when something is changed, or on upgrading, it's
important to describe those, too. Think of things that may go wrong and include them here.
This is important to minimize requests for support, and to avoid doc comments with
questions that you know someone might ask.

Each scenario can be a third-level heading, for example `### Getting error message X`.
If you have none to add when creating a doc, leave this section in place
but commented out to help encourage others to add to it in the future. -->
