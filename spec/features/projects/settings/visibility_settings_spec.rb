# frozen_string_literal: true

require 'spec_helper'

RSpec.describe 'Projects > Settings > Visibility settings', :js, feature_category: :groups_and_projects do
  let(:user) { create(:user) }
  let(:project) { create(:project, namespace: user.namespace, visibility_level: 20) }

  context 'as owner' do
    before do
      sign_in(user)
      visit edit_project_path(project)
    end

    it 'project visibility select is available' do
      visibility_select_container = find('.project-visibility-setting')

      expect(visibility_select_container.find('select').value).to eq project.visibility_level.to_s
      expect(visibility_select_container).to have_content 'Accessible by anyone, regardless of authentication.'
    end

    it 'project visibility description updates on change' do
      visibility_select_container = find('.project-visibility-setting')
      visibility_select = visibility_select_container.find('select')
      visibility_select.select('Private')

      expect(visibility_select.value).to eq '0'
      expect(visibility_select_container).to have_content 'Only accessible by project members. Membership must be explicitly granted to each user.'
    end

    context 'disable email notifications' do
      it 'is visible' do
        expect(page).to have_selector('.js-emails-disabled', visible: true)
      end

      it 'accepts the changed state' do
        find('.js-emails-disabled input[type="checkbox"]').click

        expect { save_permissions_group }.to change { updated_emails_disabled? }.to(true)
      end
    end
  end

  context 'as maintainer' do
    let(:maintainer_user) { create(:user) }

    before do
      project.add_maintainer(maintainer_user)
      sign_in(maintainer_user)
      visit edit_project_path(project)
    end

    it 'project visibility is locked' do
      visibility_select_container = find('.project-visibility-setting')

      expect(visibility_select_container).to have_selector 'select[name="project[visibility_level]"]:disabled'
      expect(visibility_select_container).to have_content 'Accessible by anyone, regardless of authentication.'
    end

    context 'disable email notifications' do
      it 'is not available' do
        expect(page).not_to have_selector('.js-emails-disabled', visible: true)
      end
    end
  end

  def save_permissions_group
    page.within('.sharing-permissions') do
      click_button 'Save changes'
      wait_for_requests
    end
  end

  def updated_emails_disabled?
    project.reload.clear_memoization(:emails_disabled)
    project.emails_disabled?
  end
end
