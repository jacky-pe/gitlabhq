import Vue, { nextTick } from 'vue';
import { GlButton } from '@gitlab/ui';
import VueApollo from 'vue-apollo';
import createMockApollo from 'helpers/mock_apollo_helper';
import { createMockDirective, getBinding } from 'helpers/vue_mock_directive';
import { shallowMountExtended, mountExtended } from 'helpers/vue_test_utils_helper';
import runnerTogglePausedMutation from '~/ci/runner/graphql/shared/runner_toggle_paused.mutation.graphql';
import waitForPromises from 'helpers/wait_for_promises';
import { captureException } from '~/ci/runner/sentry_utils';
import { createAlert } from '~/alert';
import {
  I18N_PAUSE,
  I18N_PAUSE_TOOLTIP,
  I18N_RESUME,
  I18N_RESUME_TOOLTIP,
} from '~/ci/runner/constants';

import RunnerPauseButton from '~/ci/runner/components/runner_pause_button.vue';
import { allRunnersData } from '../mock_data';

const mockRunner = allRunnersData.data.runners.nodes[0];

Vue.use(VueApollo);

jest.mock('~/alert');
jest.mock('~/ci/runner/sentry_utils');

describe('RunnerPauseButton', () => {
  let wrapper;
  let runnerTogglePausedHandler;

  const getTooltip = () => getBinding(wrapper.element, 'gl-tooltip').value;
  const findBtn = () => wrapper.findComponent(GlButton);

  const createComponent = ({ props = {}, mountFn = shallowMountExtended } = {}) => {
    const { runner, ...propsData } = props;

    wrapper = mountFn(RunnerPauseButton, {
      propsData: {
        runner: {
          id: mockRunner.id,
          paused: mockRunner.paused,
          ...runner,
        },
        ...propsData,
      },
      apolloProvider: createMockApollo([[runnerTogglePausedMutation, runnerTogglePausedHandler]]),
      directives: {
        GlTooltip: createMockDirective('gl-tooltip'),
      },
    });
  };

  const clickAndWait = async () => {
    findBtn().vm.$emit('click');
    await waitForPromises();
  };

  beforeEach(() => {
    runnerTogglePausedHandler = jest.fn().mockImplementation(({ input }) => {
      return Promise.resolve({
        data: {
          runnerUpdate: {
            runner: {
              id: input.id,
              paused: !input.paused,
            },
            errors: [],
          },
        },
      });
    });

    createComponent();
  });

  describe('Pause/Resume action', () => {
    describe.each`
      runnerState | icon       | content        | tooltip                | isPaused | newPausedValue
      ${'paused'} | ${'play'}  | ${I18N_RESUME} | ${I18N_RESUME_TOOLTIP} | ${true}  | ${false}
      ${'active'} | ${'pause'} | ${I18N_PAUSE}  | ${I18N_PAUSE_TOOLTIP}  | ${false} | ${true}
    `('When the runner is $runnerState', ({ icon, content, tooltip, isPaused, newPausedValue }) => {
      beforeEach(() => {
        createComponent({
          props: {
            runner: {
              paused: isPaused,
            },
          },
        });
      });

      it(`Displays a ${icon} button`, () => {
        expect(findBtn().props('loading')).toBe(false);
        expect(findBtn().props('icon')).toBe(icon);
      });

      it('Displays button content', () => {
        expect(findBtn().text()).toBe(content);
        expect(getTooltip()).toBe(tooltip);
      });

      it('Does not display redundant text for screen readers', () => {
        expect(findBtn().attributes('aria-label')).toBe(undefined);
      });

      describe(`Before the ${icon} button is clicked`, () => {
        it('The mutation has not been called', () => {
          expect(runnerTogglePausedHandler).not.toHaveBeenCalled();
        });
      });

      describe(`Immediately after the ${icon} button is clicked`, () => {
        const setup = async () => {
          findBtn().vm.$emit('click');
          await nextTick();
        };

        it('The button has a loading state', async () => {
          await setup();

          expect(findBtn().props('loading')).toBe(true);
        });

        it('The stale tooltip is removed', async () => {
          await setup();

          expect(getTooltip()).toBe('');
        });
      });

      describe(`After clicking on the ${icon} button`, () => {
        beforeEach(async () => {
          await clickAndWait();
        });

        it(`The mutation to that sets "paused" to ${newPausedValue} is called`, () => {
          expect(runnerTogglePausedHandler).toHaveBeenCalledTimes(1);
          expect(runnerTogglePausedHandler).toHaveBeenCalledWith({
            input: {
              id: mockRunner.id,
              paused: newPausedValue,
            },
          });
        });

        it('The button does not have a loading state', () => {
          expect(findBtn().props('loading')).toBe(false);
        });

        it('The button emits toggledPaused', () => {
          expect(wrapper.emitted('toggledPaused')).toHaveLength(1);
        });
      });

      describe('When update fails', () => {
        describe('On a network error', () => {
          const mockErrorMsg = 'Update error!';

          beforeEach(async () => {
            runnerTogglePausedHandler.mockRejectedValueOnce(new Error(mockErrorMsg));

            await clickAndWait();
          });

          it('error is reported to sentry', () => {
            expect(captureException).toHaveBeenCalledWith({
              error: new Error(mockErrorMsg),
              component: 'RunnerPauseButton',
            });
          });

          it('error is shown to the user', () => {
            expect(createAlert).toHaveBeenCalledTimes(1);
          });
        });

        describe('On a validation error', () => {
          const mockErrorMsg = 'Runner not found!';
          const mockErrorMsg2 = 'User not allowed!';

          beforeEach(async () => {
            runnerTogglePausedHandler.mockResolvedValueOnce({
              data: {
                runnerUpdate: {
                  runner: {
                    id: mockRunner.id,
                    paused: isPaused,
                  },
                  errors: [mockErrorMsg, mockErrorMsg2],
                },
              },
            });

            await clickAndWait();
          });

          it('error is reported to sentry', () => {
            expect(captureException).toHaveBeenCalledWith({
              error: new Error(`${mockErrorMsg} ${mockErrorMsg2}`),
              component: 'RunnerPauseButton',
            });
          });

          it('error is shown to the user', () => {
            expect(createAlert).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });

  describe('When displaying a compact button for an active runner', () => {
    beforeEach(() => {
      createComponent({
        props: {
          runner: {
            paused: false,
          },
          compact: true,
        },
        mountFn: mountExtended,
      });
    });

    it('Displays no text', () => {
      expect(findBtn().text()).toBe('');

      // Note: Use <template v-if> to ensure rendering a
      // text-less button. Ensure we don't send even empty an
      // content slot to prevent a distorted/rectangular button.
      expect(wrapper.find('.gl-button-text').exists()).toBe(false);
    });

    it('Display correctly for screen readers', () => {
      expect(findBtn().attributes('aria-label')).toBe(I18N_PAUSE);
      expect(getTooltip()).toBe(I18N_PAUSE_TOOLTIP);
    });

    describe('Immediately after the button is clicked', () => {
      const setup = async () => {
        findBtn().vm.$emit('click');
        await nextTick();
      };

      it('The button has a loading state', async () => {
        await setup();

        expect(findBtn().props('loading')).toBe(true);
      });

      it('The stale tooltip is removed', async () => {
        await setup();

        expect(getTooltip()).toBe('');
      });
    });
  });
});
