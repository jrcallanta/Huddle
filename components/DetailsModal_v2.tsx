import React, { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { HuddleTypeForTile } from "@/types";

import { BsX } from "react-icons/bs";
import { FaTrashCan } from "react-icons/fa6";

import ActionsBar from "./ActionsBar";
import FormDiv from "./switch-components/FormDiv";
import EditableTitle from "./switch-components/EditableTitle";
import TimePicker from "./switch-components/TimePicker";
import InviteListSelector from "./switch-components/InviteListSelector";
import UserAvatar from "./UserAvatar";
import LocationSelector from "./switch-components/LocationSelector";
import { useHuddleOwnerEditor } from "@/hooks/useHuddleOwnerEditor";
import { useHuddleInviteResponder } from "@/hooks/useHuddleInviteResponder";
import { useDetailsModalReducer } from "@/hooks/useDetailsModalReducer";

export const INPUT_NAMES = {
    TITLE: "title",
    START_TIME: "start-time",
    END_TIME: "end-time",
    LOCATION: "location",
};

interface DetailsModalProps {
    huddle: HuddleTypeForTile;
    isInEditingMode: boolean;
    onClose?: any;
}

const DetailsModal: React.FC<DetailsModalProps> = ({
    huddle,
    isInEditingMode: isInEditingModeInitial,
    onClose,
}) => {
    const { currentUser } = useUser();

    const container = document.getElementById("details-modal-root");
    // const [huddleState, setHuddleState] = useState(huddle);
    // const [feedback, setFeedback] = useState<string | null>(null);

    const {
        state: { huddleState, feedback },
        dispatch,
    } = useDetailsModalReducer(huddle);

    // Logic for Editing
    const {
        states: { isInEditingMode },
        handlers: {
            handleOpenEditMode,
            handleCloseEditMode,
            handleSaveDetails,
            handleDelete,
        },
    } = useHuddleOwnerEditor({
        deps: { originalHuddle: huddle, isInEditingModeInitial },
        states: { huddleState },
        funcs: { dispatch, onCloseEditor: onClose },
    });

    // Logic for Responding
    const {
        states: { isUpdatingInviteStatus },
        handlers: { handleToggleAcceptInvite, handleToggleDeclineInvite },
    } = useHuddleInviteResponder({
        deps: { originalHuddle: huddle },
        states: { huddleState },
        funcs: { dispatch },
    });

    return container && huddleState
        ? createPortal(
              <div
                  onClick={(e) => e.stopPropagation()}
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
                                  (!huddleState.invite_status ||
                                      huddleState.invite_status === "GOING") &&
                                      "stroke-[var(--700)] fill-[var(--700)]"
                              )}
                          />
                      </button>
                      <p className='text-xs text-center text-white/75 hover:text-white font-medium cursor-pointer'>{`${huddleState.author.name}`}</p>
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
                              type='button'
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
                          inputId={`${INPUT_NAMES.TITLE}-input`}
                          name={INPUT_NAMES.TITLE}
                          isEditing={isInEditingMode}
                          onValueChange={(newTitle) =>
                              dispatch({
                                  type: "EDIT_TITLE",
                                  payload: newTitle,
                              })
                          }
                          className={twMerge(
                              "w-full bg-inherit text-2xl font-bold outline-none placeholder:text-white/50 focus:text-white truncate",
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
                                  onValueChange={(newTime) =>
                                      dispatch({
                                          type: "EDIT_START_TIME",
                                          payload: newTime,
                                      })
                                  }
                                  className={twMerge(
                                      "w-full bg-inherit text-xl text-white text-right font-bold focus:text-white",
                                      !isInEditingMode
                                          ? "text-white"
                                          : "text-white/50"
                                  )}
                              />
                              <TimePicker
                                  optional
                                  label='to'
                                  initialTime={huddleState.end_time}
                                  lowerBound={huddleState.start_time}
                                  isEditing={isInEditingMode}
                                  onValueChange={(newTime) =>
                                      dispatch({
                                          type: "EDIT_END_TIME",
                                          payload: newTime,
                                      })
                                  }
                                  className={twMerge(
                                      "w-full bg-inherit text-xl text-white text-right font-bold focus:text-white",
                                      !isInEditingMode
                                          ? "text-white"
                                          : "text-white/50"
                                  )}
                              />
                          </div>
                      </div>
                  </div>

                  {(huddleState.location || isInEditingMode) && (
                      <div className='section flex w-full [&:hover_>_*]:!bg-white/20'>
                          <LocationSelector
                              location={huddleState.location || null}
                              inputId={`${INPUT_NAMES.LOCATION}-input`}
                              name={INPUT_NAMES.LOCATION}
                              isEditing={isInEditingMode}
                              onValueChange={(newValue) =>
                                  dispatch({
                                      type: "EDIT_LOCATION",
                                      payload: newValue,
                                  })
                              }
                              className={twMerge(
                                  "w-full bg-inherit text-sm font-medium outline-none placeholder:text-white/50 focus:text-white truncate",
                                  !isInEditingMode
                                      ? "text-white"
                                      : "text-white/50"
                              )}
                          />
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
                      {(huddleState.invite_status === "PENDING" ||
                          isUpdatingInviteStatus ||
                          feedback) && (
                          <div className='mt-auto p-2 bg-white/50 shadow-md'>
                              <p
                                  className={twMerge(
                                      "text-[var(--600)] text-xs text-center font-semibold transition-all",
                                      !isUpdatingInviteStatus && "animate-pulse"
                                  )}
                              >
                                  {isUpdatingInviteStatus
                                      ? "UPDATING..."
                                      : !feedback
                                      ? "AWAITING YOUR RESPONSE..."
                                      : feedback}
                              </p>
                          </div>
                      )}

                      {huddleState.invite_status && (
                          <ActionsBar
                              interactions='invite'
                              onAccept={handleToggleAcceptInvite}
                              isAccepted={huddleState.invite_status === "GOING"}
                              onDecline={handleToggleDeclineInvite}
                              isDeclined={
                                  huddleState.invite_status === "NOT_GOING"
                              }
                          />
                      )}

                      {!huddleState.invite_status && (
                          <>
                              {!isInEditingMode ? (
                                  <ActionsBar
                                      interactions='owner'
                                      onEdit={handleOpenEditMode}
                                  />
                              ) : (
                                  <ActionsBar
                                      interactions='editor'
                                      onSave={handleSaveDetails}
                                      onCancel={handleCloseEditMode}
                                  />
                              )}
                          </>
                      )}
                  </div>
              </div>,
              container
          )
        : null;
};

export default DetailsModal;
