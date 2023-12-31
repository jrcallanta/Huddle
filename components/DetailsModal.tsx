import React, { useCallback, useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { HuddleTypeForTile, LocationType } from "@/types";

import { BsX } from "react-icons/bs";
import { FaTrashCan } from "react-icons/fa6";

import ActionsBar from "./ActionsBar";
import FormDiv from "./switch-components/FormDiv";
import EditableTitle from "./switch-components/EditableTitle";
import TimePicker from "./switch-components/TimePicker";
import InviteListSelector from "./switch-components/InviteListSelector";
import UserAvatar from "./UserAvatar";
import { useHuddles } from "@/hooks/useHuddles";
import LocationSelector from "./switch-components/LocationSelector";

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
    const {
        funcs: {
            setFocusedHuddle,
            setSelectedHuddle,
            updateHuddleDetails,
            createNewHuddle,
            respondToInvite,
            deleteHuddle,
            refreshHuddles,
        },
    } = useHuddles();

    const [huddleState, setHuddleState] = useState(huddle);
    const [isInEditingMode, setisInEditingMode] = useState(
        isInEditingModeInitial
    );
    const [isUpdatingInviteStatus, setIsUpdatingInviteStatus] = useState(false);
    const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

    const container = document.getElementById("details-modal-root");

    useEffect(() => {
        return () => setisInEditingMode(false);
    }, []);

    useEffect(() => setHuddleState(huddle), [huddle]);

    const handleOpenEditMode = useCallback(async () => {
        setSaveFeedback(null);
        setisInEditingMode(true);
    }, []);

    const handleCloseEditMode = useCallback(async () => {
        if (huddle._id) {
            setSaveFeedback(null);
            setisInEditingMode(false);
        } else {
            onClose();
        }
    }, []);

    const _validateInputs: (props: {
        title: string;
        startTime: string;
        endTime: string;
    }) => boolean = ({ title, startTime, endTime }) => {
        console.log(startTime, endTime);

        if (!title || title === "") {
            setSaveFeedback("Title cannot be blank");
            return false;
        }

        if (!startTime) {
            setSaveFeedback("Huddle needs a start time");
            return false;
        }

        if (startTime && endTime && startTime >= endTime) {
            setSaveFeedback("End time must be after start time");
            return false;
        }

        return true;
    };

    const handleRespondInvite = async (event: any, respond: string) => {
        event.stopPropagation();
        setSaveFeedback(null);
        setIsUpdatingInviteStatus(true);
        setHuddleState((prev) => ({
            ...prev,
            invite_status: respond,
        }));

        if (huddle._id)
            await respondToInvite(
                {
                    huddleId: huddle._id,
                    response: respond,
                },
                async (data: any) => {
                    if (data.updatedInvite) {
                        setIsUpdatingInviteStatus(false);
                        // if (data.updatedInvite.status === "NOT_GOING")
                        //     setFocusedHuddle(null);
                        await refreshHuddles();
                    } else {
                        setTimeout(() => {
                            setSaveFeedback(
                                "Could not send response. Try again."
                            );
                            setHuddleState((prev) => ({
                                ...prev,
                                invite_status: huddle.invite_status,
                            }));
                            setIsUpdatingInviteStatus(false);
                        }, 500);
                    }
                }
            );
    };

    const handleToggleAcceptInvite = (event: any) =>
        handleRespondInvite(
            event,
            huddleState.invite_status !== "GOING" ? "GOING" : "PENDING"
        );

    const handleToggleDeclineInvite = (event: any) => {
        handleRespondInvite(
            event,
            huddleState.invite_status !== "NOT_GOING" ? "NOT_GOING" : "PENDING"
        );
    };

    const handleSaveDetails = async (event: any) => {
        event.preventDefault();

        const form = document.getElementById("huddle-form") as HTMLFormElement;
        if (!form) return;

        const formData = new FormData(form);
        const newTitle = formData.get(INPUT_NAMES.TITLE);
        const newStartTime = formData.get(`${INPUT_NAMES.START_TIME}-hidden`);
        const newEndTime = formData.get(`${INPUT_NAMES.END_TIME}-hidden`);
        const display = formData.get(INPUT_NAMES.LOCATION);
        const description = formData.get(`${INPUT_NAMES.LOCATION}-desc-hidden`);
        const lat = Number(formData.get(`${INPUT_NAMES.LOCATION}-lat-hidden`));
        const lng = Number(formData.get(`${INPUT_NAMES.LOCATION}-lng-hidden`));
        const newLocation =
            display !== "" && description !== "" && lat && lng
                ? {
                      display: { primary: display, description },
                      coordinates: { lat, lng },
                  }
                : null;
        const valid = _validateInputs({
            title: newTitle as string,
            startTime: newStartTime as string,
            endTime: newEndTime as string,
        });

        if (!valid) return;

        // Update Optimistic UI
        setHuddleState((prev) => {
            return {
                ...prev,
                title: newTitle as string,
                start_time: new Date(Number(newStartTime)),
                end_time:
                    newEndTime !== "?" ? new Date(Number(newEndTime)) : null,
                location: newLocation as LocationType,
            } as HuddleTypeForTile;
        });
        setSaveFeedback("Saving...");

        if (huddle._id)
            updateHuddleDetails(
                {
                    huddleId: huddle?._id,
                    changes: {
                        ...huddleState,
                        title: newTitle as string,
                        startTime: new Date(Number(newStartTime)),
                        endTime:
                            newEndTime !== "?"
                                ? new Date(Number(newEndTime))
                                : null,
                        location: newLocation as LocationType,
                    },
                },
                (data: any) => {
                    if (!data.error) {
                        setisInEditingMode(false);
                        refreshHuddles();
                        setSaveFeedback(null);
                    } else {
                        setTimeout(() => {
                            setSaveFeedback(
                                "Could not save changes. Try again."
                            );
                        }, 500);
                    }
                }
            );
        else
            createNewHuddle(
                {
                    ...huddleState,
                    title: newTitle as string,
                    start_time: new Date(Number(newStartTime)),
                    end_time:
                        newEndTime !== "?"
                            ? new Date(Number(newEndTime))
                            : undefined,
                    location: newLocation as LocationType,
                },
                async (data: any) => {
                    if (data.newHuddle) {
                        console.log(data.newHuddle);
                        setisInEditingMode(false);
                        await refreshHuddles();
                        setSelectedHuddle(data.newHuddle);
                        setFocusedHuddle(data.newHuddle);
                        setSaveFeedback(null);
                    } else {
                        setTimeout(() => {
                            setSaveFeedback(
                                "Could not save changes. Try again."
                            );
                        }, 500);
                    }
                }
            );
    };

    const handleDelete = () => {
        if (huddle._id) {
            setSaveFeedback("Deleting...");
            deleteHuddle({ huddleId: huddle._id }, (data: any) => {
                if (!data.error) {
                    setFocusedHuddle(null);
                    refreshHuddles();
                } else setSaveFeedback("Could not delete. Try again.");
            });
        }
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
                                  inputId={`${INPUT_NAMES.START_TIME}-input`}
                                  name={INPUT_NAMES.START_TIME}
                                  isEditing={isInEditingMode}
                                  className={twMerge(
                                      "w-full bg-inherit text-xl text-white font-bold outline-none placeholder:text-white/50 focus:text-white",
                                      !isInEditingMode
                                          ? "text-white"
                                          : "text-white/50"
                                  )}
                              />
                              <TimePicker
                                  optional
                                  label='to'
                                  initialTime={huddleState.end_time}
                                  inputId={`${INPUT_NAMES.END_TIME}-input`}
                                  name={INPUT_NAMES.END_TIME}
                                  isEditing={isInEditingMode}
                                  className={twMerge(
                                      "w-full bg-inherit text-xl text-white font-bold outline-none placeholder:text-white/50 focus:text-white",
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
              </FormDiv>,
              container
          )
        : null;
};

export default DetailsModal;
