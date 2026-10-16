
import styled from "styled-components";
import { useEffect, useState } from "react";
import {
  Wallet,
  ReceiptText,
  Tags,
  CheckCircle2,
  ChevronRight,
  X,
} from "lucide-react";

const CockpitWrapper = styled.section`
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #dedede;
  border-radius: 12px;
  background: #fff;
  color: #000;
  font-family: "IBM Plex Mono", monospace;
`;

const CockpitHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Eyebrow = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Heading = styled.h2`
  margin: 0 0 0.5rem;
  font-size: clamp(1.2rem, 3vw, 1.7rem);
`;

const Description = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.85rem;
  line-height: 1.6;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0.4rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  color: #000;
  cursor: pointer;

  &:hover {
    background: #f2f2f2;
  }
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.6rem;
  font-size: 0.8rem;
`;

const ProgressTrack = styled.div`
  height: 6px;
  overflow: hidden;
  border-radius: 99px;
  background: #e8e8e8;
  margin-bottom: 1.5rem;
`;

const ProgressFill = styled.div`
  width: ${({ $progress }) => `${$progress}%`};
  height: 100%;
  background: #000;
  transition: width 250ms ease;
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
`;

const Task = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem 0;
  border-top: 1px solid #eee;
`;

const TaskIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 8px;
  background: ${({ $complete }) =>
    $complete ? "#e9f5ec" : "#f3f3f3"};
  color: ${({ $complete }) =>
    $complete ? "#24723a" : "#000"};
`;

const TaskContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const TaskTitle = styled.h3`
  margin: 0 0 0.35rem;
  font-size: 0.9rem;
`;

const TaskDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.75rem;
  line-height: 1.5;
`;

const TaskButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  color: #000;
  font: inherit;
  font-size: 0.75rem;
  cursor: pointer;

  &:hover {
    background: #f2f2f2;
  }

  @media (max-width: 480px) {
    span {
      display: none;
    }
  }
`;

const SuccessMessage = styled.p`
  padding: 1rem;
  margin: 1rem 0 0;
  border-radius: 8px;
  background: #e9f5ec;
  color: #24723a;
  font-size: 0.85rem;
  line-height: 1.6;
`;

export default function OnboardingCockpit({
  hasAccount = false,
  hasTransaction = false,
  hasOrganizedFinances = false,
  onAddAccount,
  onAddTransaction,
  onOrganizeFinances,
}) {

//   const [isDismissed, setIsDismissed] = useState(false);
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     try {
//       setIsDismissed(
//         localStorage.getItem("moneo-onboarding-dismissed") === "true"
//       );
//     } catch {
//       // Keep the cockpit available if browser storage is unavailable.
//     }

//     setIsReady(true);
//   }, []);

  const tasks = [
    {
      id: "account",
      title: "Set up your account",
      description: "Add your first bank account or cash wallet.",
      complete: hasAccount,
      icon: Wallet,
      action: onAddAccount,
      actionLabel: "Add account",
    },
    {
      id: "transaction",
      title: "Add your first transaction",
      description: "Record an income or expense.",
      complete: hasTransaction,
      icon: ReceiptText,
      action: onAddTransaction,
      actionLabel: "Add transaction",
    },
    {
      id: "organize",
      title: "Organize your finances",
      description: "Categorize a transaction to improve your overview.",
      complete: hasOrganizedFinances,
      icon: Tags,
      action: onOrganizeFinances,
      actionLabel: "Organize",
    },
  ];

  // PROGRESS OF TASK 
  const completedTasks = tasks.filter((task) => task.complete).length;
  const progress = (completedTasks / tasks.length) * 100;

  // DISSMISED TASK
//   function dismissCockpit() {
//     setIsDismissed(true);

//     try {
//       localStorage.setItem("moneo-onboarding-dismissed", "true");
//     } catch {
//       // Dismiss for the current session if storage is unavailable.
//     }
//   }

//   if (!isReady || isDismissed) {
//     return null;
//   }

  return (
<CockpitWrapper
  id="onboarding" aria-label="MONEO onboarding checklist">
      <CockpitHeader>
        <div>
          <Eyebrow>MONEO / GETTING STARTED</Eyebrow>

          <Heading>
            {completedTasks === 3
              ? "Your cockpit is ready."
              : "Your money, in focus."}
          </Heading>

          <Description>
            {completedTasks === 3
              ? "You've completed all three suggested tasks. Your dashboard is ready to explore."
              : "Complete these suggested steps to get more from your financial overview. You can use MONEO at any time."}
          </Description>
        </div>

        {/* <IconButton
          type="button"
          onClick={dismissCockpit}
          aria-label="Dismiss onboarding"
          title="Dismiss onboarding"
        >
          <X size={18} />
        </IconButton> */}
      </CockpitHeader>

      <ProgressHeader>
        <span>YOUR PROGRESS</span>
        <strong>{completedTasks}/3</strong>
      </ProgressHeader>

      <ProgressTrack
        role="progressbar"
        aria-label="Onboarding progress"
        aria-valuemin={0}
        aria-valuemax={3}
        aria-valuenow={completedTasks}
      >
        <ProgressFill $progress={progress} />
      </ProgressTrack>

      <TaskList>
        {tasks.map((task) => {
          const Icon = task.icon;

          return (
            <Task key={task.id}>
              <TaskIcon $complete={task.complete}>
                {task.complete ? (
                  <CheckCircle2 size={21} />
                ) : (
                  <Icon size={21} />
                )}
              </TaskIcon>

              <TaskContent>
                <TaskTitle>{task.title}</TaskTitle>
                <TaskDescription>
                  {task.complete
                    ? "Completed"
                    : task.description}
                </TaskDescription>
              </TaskContent>

              {!task.complete && task.action && (
                <TaskButton
                  type="button"
                  onClick={task.action}
                  aria-label={task.actionLabel}
                >
                  <span>{task.actionLabel}</span>
                  <ChevronRight size={16} />
                </TaskButton>
              )}
            </Task>
          );
        })}
      </TaskList>

      {completedTasks === 3 && (
        <SuccessMessage role="status">
          All three tasks are complete. You can dismiss this checklist
          whenever youre ready.
        </SuccessMessage>
      )}
    </CockpitWrapper>
  );
}
