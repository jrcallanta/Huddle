import { HuddleTypeForTile } from "@/types";
import dateFormat from "dateformat";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { GrLocation } from "react-icons/gr";
import AvatarList from "./AvatarList";
import { createPortal } from "react-dom";
import ActionsBar, {
    HuddleEditActions,
    HuddleInviteResponseActions,
} from "./ActionsBar";
import { BsX } from "react-icons/bs";
import FormDiv from "./switch-components/FormDiv";
import EditableTitle from "./switch-components/EditableTitle";
import { useUser } from "@/hooks/useUser";

/* NOTE:    When on 'By Timeline' tab,
            updating invite response through
            DetailsModal doesn't update styling
            as when on 'By Plan' tab.
*/
interface DetailsModalProps {
    huddle: HuddleTypeForTile | null;
    isUpdatingInviteStatus: boolean;
    isInEditingMode: boolean;
    onClose?: any;
    onRefresh?: any;
    actionsBarActions: {
        huddleEditActions?: HuddleEditActions;
        huddleInviteResponseActions?: HuddleInviteResponseActions;
    };
}

const DetailsModal: React.FC<DetailsModalProps> = ({
    huddle,
    isUpdatingInviteStatus,
    isInEditingMode: isInEditingModeInitial,
    onClose,
    onRefresh,
    actionsBarActions,
}) => {
    const [huddleState, setHuddleState] = useState(huddle);
    const { currentUser } = useUser();
    const container = document.getElementById("details-modal-root");
    const [isInEditingMode, setisInEditingMode] = useState(
        isInEditingModeInitial
    );
    const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

    const toggleEditMode = () => {
        setSaveFeedback(null);
        setisInEditingMode((prev) => !prev);
    };

    const handleSaveDetails = (event: any) => {
        event.preventDefault();
        console.log("saving");

        const newTitle = new FormData(event.target).get("title");
        setHuddleState((prev) => {
            return { ...prev, title: newTitle } as HuddleTypeForTile;
        });
        setSaveFeedback(null);

        const fetchRequest = async () => {
            await fetch("/api/huddle/edit", {
                method: "PATCH",
                body: JSON.stringify({
                    userId: currentUser?._id,
                    huddleId: huddleState?._id,
                    changes: {
                        title: newTitle,
                    },
                }),
            })
                .then((res) => res.json())
                .then(async (data) => {
                    if (data.updatedHuddle) {
                        setisInEditingMode(false);
                        await onRefresh();
                    } else {
                        setTimeout(() => {
                            setHuddleState(huddle);
                            setSaveFeedback(
                                "Could not save changes. Try again."
                            );
                        }, 500);
                    }
                });
        };
        fetchRequest();
    };

    return container && huddleState
        ? createPortal(
              <FormDiv
                  type={isInEditingMode ? "form" : "div"}
                  formId='huddle-form'
                  className={twMerge(
                      !huddleState.invite_status ||
                          huddleState.invite_status === "GOING"
                          ? "themed-darker"
                          : "themed",
                      "absolute overflow-clip top-0 h-full left-0 right-0 rounded-3xl flex flex-col",
                      "bg-[var(--500)] border-4 border-[var(--600)] [&_.section]:bg-[var(--400)]",
                      "[&_>_.section:not(:last-of-type)]:border-b-2 [&_>_.section]:border-inherit [&_>_.section]:transition-colors"
                  )}
                  onSubmit={handleSaveDetails}
              >
                  <div className='section border-none w-full flex justify-center items-center p-4 gap-2'>
                      <p className='text text-sm text-center text-white/75 hover:text-white font-medium cursor-pointer'>{`@${huddleState.author.username}`}</p>
                  </div>

                  <div id='header' className='section flex flex-col gap-4 p-4'>
                      <div
                          id='header-title'
                          className={twMerge(
                              "w-full flex",
                              isInEditingMode && "before-bg"
                          )}
                      >
                          <EditableTitle
                              text={huddleState.title}
                              inputId={"title-input"}
                              name={"title"}
                              isEditing={isInEditingMode}
                              className={twMerge(
                                  "w-full bg-inherit text text-2xl font-bold outline-none placeholder:text-white/50 focus:text-white",
                                  !isInEditingMode
                                      ? "text-white"
                                      : "text-white/50"
                              )}
                          />
                      </div>
                      <div
                          id='header-time'
                          className='w-full flex justify-stretch'
                      >
                          <div className='w-full flex flex-col md:flex-row '>
                              <div className='w-full flex items-baseline gap-4'>
                                  <p className='text w-12 md:w-fit text-sm font-bold text-white/50'>
                                      from
                                  </p>
                                  <p className='w-full text text-xl font-bold text-white'>
                                      {dateFormat(
                                          huddleState.start_time,
                                          "h:MMtt"
                                      )}
                                  </p>
                              </div>
                              <div className='w-full flex items-baseline gap-4'>
                                  <p className='text w-12 md:w-fit text-sm font-bold text-white/50'>
                                      to
                                  </p>
                                  <p className='w-full text text-xl font-bold text-white'>
                                      {huddleState.end_time
                                          ? dateFormat(
                                                huddleState.end_time,
                                                "h:MMtt"
                                            )
                                          : "?"}
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>

                  {huddleState.location && (
                      <div className='section flex flex-col p-4 cursor-pointer [&.section:hover]:brightness-[1.1] transition-all'>
                          <a
                              href=''
                              target={"_blank"}
                              onClick={(e) => e.stopPropagation()}
                              className='location w-fit flex gap-1 items-center  [&_>_svg_path]:stroke-white/80 [&:hover_>_svg_path]:stroke-white [&:hover_>_p]:text-white'
                          >
                              <GrLocation size={24} />
                              <p className='text-white/80 text-sm font-medium'>
                                  {huddleState.location.display}
                              </p>
                          </a>
                      </div>
                  )}

                  {huddleState.invite_list && (
                      <div className='section flex flex-col p-4 cursor-pointer [&.section:hover]:brightness-[1.1] transition-all'>
                          <AvatarList
                              inviteList={[
                                  {
                                      status: "GOING",
                                      user: huddleState.author,
                                      huddle_id: huddleState._id,
                                      created_at: huddleState.created_at,
                                  },
                                  ...huddleState.invite_list,
                              ]}
                          />
                      </div>
                  )}

                  <div className='section mt-auto'>
                      {(huddleState?.invite_status === "PENDING" ||
                          isUpdatingInviteStatus ||
                          saveFeedback) && (
                          <div className='mt-auto p-2 bg-white/50 shadow-md'>
                              <p
                                  className={twMerge(
                                      "text-[var(--600)] text-xs text-center font-semibold transition-all",
                                      !isUpdatingInviteStatus && "animate-pulse"
                                  )}
                              >
                                  {isUpdatingInviteStatus
                                      ? "UPDATING..."
                                      : !saveFeedback
                                      ? "AWAITING YOUR RESPONSE..."
                                      : saveFeedback}
                              </p>
                          </div>
                      )}

                      <ActionsBar
                          //   className={"border-none"}
                          inviteStatus={huddleState?.invite_status}
                          huddleInviteResponseActions={
                              actionsBarActions.huddleInviteResponseActions
                          }
                          huddleEditActions={
                              actionsBarActions.huddleEditActions && {
                                  onEditDetails: !isInEditingMode
                                      ? toggleEditMode
                                      : undefined,
                                  onSaveChanges: isInEditingMode
                                      ? handleSaveDetails
                                      : undefined,
                                  onDiscardChanges: isInEditingMode
                                      ? toggleEditMode
                                      : undefined,
                              }
                          }
                      />
                  </div>

                  <button
                      className={
                          "absolute left-2 top-3 flex justify-center items-center"
                      }
                      onClick={onClose}
                  >
                      <BsX
                          size={32}
                          strokeWidth={".5px"}
                          className={twMerge(
                              "stroke-[var(--700)] fill-[var(--700)] hover:fill-white hover:stroke-white",
                              (!huddleState?.invite_status ||
                                  huddleState?.invite_status === "GOING") &&
                                  "stroke-[var(--700)] fill-[var(--700)]"
                          )}
                      />
                  </button>
              </FormDiv>,
              container
          )
        : null;
};

export default DetailsModal;
