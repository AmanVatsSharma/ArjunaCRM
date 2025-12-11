import { isDefined } from 'arjuna-shared/utils';
import { StepStatus, type WorkflowRunStepInfos } from 'arjuna-shared/workflow';

export const stepHasBeenStarted = (
  stepId: string,
  stepInfos: WorkflowRunStepInfos,
) => {
  return (
    isDefined(stepInfos[stepId]?.status) &&
    stepInfos[stepId].status !== StepStatus.NOT_STARTED
  );
};
