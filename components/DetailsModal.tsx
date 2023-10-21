import React, { useCallback, useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { HuddleTypeForTile } from "@/types";

import { GrLocation } from "react-icons/gr";
import { BsX } from "react-icons/bs";
import { FaTrashCan } from "react-icons/fa6";

import ActionsBar, {
    HuddleEditActions,
    HuddleInviteResponseActions,
} from "./ActionsBar";
import FormDiv from "./switch-components/FormDiv";
import EditableTitle from "./switch-components/EditableTitle";
import TimePicker from "./switch-components/TimePicker";
import InviteListSelector from "./switch-components/InviteListSelector";
import UserAvatar from "./UserAvatar";

interface DetailsModalProps {
    huddle: HuddleTypeForTile | null;
    isUpdatingInviteStatus: boolean;
    isInEditingMode: boolean;
    onClose?: any;
    onRefresh?: any;
    onDelete?: (data: any) => any | Promise<any>;
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
    onDelete,
    actionsBarActions,
}) => {
    const { currentUser } = useUser();

    const [huddleState, setHuddleState] = useState(huddle);
    const container = document.getElementById("details-modal-root");
    const [isInEditingMode, setisInEditingMode] = useState(
        isInEditingModeInitial
    );
    const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

    useEffect(() => setHuddleState(huddle), [huddle]);

    const openEditMode = useCallback(async () => {
        setSaveFeedback(null);
        setisInEditingMode(true);
    }, []);

    const closeEditMode = useCallback(async () => {
        setSaveFeedback(null);
        setisInEditingMode(false);
    }, []);

    const _validateInputs: (props: {
        title: string;
        startTime: string;
        endTime: string;
    }) => boolean = ({ title, startTime, endTime }) => {
        if (!title || title === "") {
            setSaveFeedback("Title cannot be blank");
            return false;
        }

        if (!startTime) {
            setSaveFeedback("Huddle needs a start time");
            return false;
        }

        if (startTime && endTime && startTime > endTime) {
            setSaveFeedback("End time cannot be before start time");
            return false;
        }

        return true;
    };

    const handleSaveDetails = async (event: any) => {
        event.preventDefault();
        console.log("saving");

        const formData = new FormData(event.target);
        const newTitle = formData.get("title");
        const startTime = formData.get("start-time-hidden");
        const endTime = formData.get("end-time-hidden");

        const valid = _validateInputs({
            title: newTitle as string,
            startTime: startTime as string,
            endTime: endTime as string,
        });

        if (!valid) return;

        setHuddleState((prev) => {
            return {
                ...prev,
                title: newTitle,
                start_time: new Date(Number(startTime)),
                end_time:
                    endTime !== "?" ? new Date(Number(endTime)) : undefined,
            } as HuddleTypeForTile;
        });
        setSaveFeedback(null);

        if (actionsBarActions.huddleEditActions?.onSaveChanges) {
            actionsBarActions.huddleEditActions
                ?.onSaveChanges({
                    ...huddleState,
                    title: newTitle,
                    start_time: new Date(Number(startTime)),
                    end_time:
                        endTime !== "?" ? new Date(Number(endTime)) : undefined,
                })
                .then((res) => res.json())
                .then(async (data) => {
                    if (!data.error) {
                        setisInEditingMode(false);
                        if (onRefresh) await onRefresh();
                    } else {
                        setTimeout(() => {
                            setHuddleState(huddle);
                            setSaveFeedback(
                                "Could not save changes. Try again."
                            );
                        }, 500);
                    }
                });
        }
    };

    const handleDelete = () => {
        setSaveFeedback(null);

        if (onDelete)
            onDelete((data: any) => {
                if (!data.error) {
                    if (onRefresh) onRefresh();
                } else {
                    setSaveFeedback("Could not delete. Try again.");
                }
            });
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
                      "absolute overflow-clip top-0 h-full bottom-0 left-0 right-0 rounded-t-3xl md:rounded-3xl flex flex-col",
                      "bg-[var(--500)] border-4 border-[var(--600)] [&_.section]:bg-[var(--400)]",
                      "[&_>_.section:not(:last-of-type)]:border-b-2 [&_>_.section]:border-inherit [&_>_.section]:transition-colors"
                  )}
                  onSubmit={handleSaveDetails}
              >
                  <div className='relative section border-none w-full flex justify-end items-center p-4 gap-2'>
                      <button
                          className={
                              "absolute left-3 flex justify-center items-center"
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
                      <p className='text text-xs text-center text-white/75 hover:text-white font-medium cursor-pointer'>{`${huddleState.author.name}`}</p>
                      <UserAvatar
                          username={huddleState.author.username}
                          imgUrl={huddleState.author.imgUrl}
                          size='sm'
                          className='border-2 border-white'
                      />
                      {huddle?._id && isInEditingMode && (
                          <button
                              className='flex justify-center items-center'
                              onClick={handleDelete}
                          >
                              <FaTrashCan
                                  size={20}
                                  className='fill-[var(--700)] stroke-[var(--700)] hover:fill-white hover:stroke-white'
                              />
                          </button>
                      )}
                  </div>

                  <div id='header' className='section flex flex-col gap-5 p-4'>
                      <EditableTitle
                          text={huddleState.title}
                          inputId={"title-input"}
                          name={"title"}
                          isEditing={isInEditingMode}
                          className={twMerge(
                              "w-full bg-inherit text text-2xl font-bold outline-none placeholder:text-white/50 focus:text-white truncate",
                              !isInEditingMode ? "text-white" : "text-white/50"
                          )}
                      />
                      <div
                          id='header-time'
                          className='w-full flex justify-stretch'
                      >
                          <div className='w-full flex flex-col md:flex-row gap-5 md:gap-6'>
                              <TimePicker
                                  label='from'
                                  initialTime={huddleState.start_time}
                                  isEditing={isInEditingMode}
                                  inputId={"start-time-input"}
                                  name={"start-time"}
                                  className={twMerge(
                                      "w-full bg-inherit text text-xl text-white font-bold outline-none placeholder:text-white/50 focus:text-white",
                                      !isInEditingMode
                                          ? "text-white"
                                          : "text-white/50"
                                  )}
                              />
                              <TimePicker
                                  optional
                                  label='to'
                                  initialTime={huddleState.end_time}
                                  isEditing={isInEditingMode}
                                  inputId={"end-time-input"}
                                  name={"end-time"}
                                  className={twMerge(
                                      "w-full bg-inherit text text-xl text-white font-bold outline-none placeholder:text-white/50 focus:text-white",
                                      !isInEditingMode
                                          ? "text-white"
                                          : "text-white/50"
                                  )}
                              />
                          </div>
                      </div>
                  </div>

                  {huddleState.location && (
                      <div className='section flex flex-col p-4 cursor-pointer transition-all'>
                          <a
                              href=''
                              target={"_blank"}
                              onClick={(e) => e.stopPropagation()}
                              className='location w-fit flex gap-1 items-center [&_>_svg_path]:stroke-white/80 [&:hover_>_svg_path]:stroke-white [&:hover_>_p]:text-white'
                          >
                              <GrLocation size={24} />
                              <p className='text-white/80 text-sm font-medium'>
                                  {huddleState.location.display}
                              </p>
                          </a>
                      </div>
                  )}

                  {huddleState.invite_list && (
                      <>
                          <div
                              id='invite-list-modal'
                              className='absolute w-full z-[1] top-0 bottom-0 empty:pointer-events-none left-0 empty:left-full transition-[left]'
                          ></div>
                          <div className='section flex w-full h-fit cursor-pointer'>
                              <InviteListSelector
                                  currentUser={currentUser ?? undefined}
                                  huddle={huddleState}
                                  className='hover:bg-white/20'
                              />
                          </div>
                      </>
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
                          className={"border-none"}
                          inviteStatus={huddleState?.invite_status}
                          huddleInviteResponseActions={
                              actionsBarActions.huddleInviteResponseActions
                          }
                          huddleEditActions={
                              actionsBarActions.huddleEditActions && {
                                  onEditDetails: !isInEditingMode
                                      ? openEditMode
                                      : undefined,
                                  onSaveChanges: isInEditingMode
                                      ? handleSaveDetails
                                      : undefined,
                                  onDiscardChanges:
                                      isInEditingMode &&
                                      !actionsBarActions.huddleEditActions
                                          .preventDiscard
                                          ? closeEditMode
                                          : undefined,
                              }
                          }
                      />
                  </div>
              </FormDiv>,
              container
          )
        : null;
};

export default DetailsModal;
