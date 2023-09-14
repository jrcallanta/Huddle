import { HuddleTypeForTile } from "@/types";
import dateFormat from "dateformat";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { GrLocation } from "react-icons/gr";
import AvatarList from "./AvatarList";
import { createPortal } from "react-dom";
import { useUser } from "@/hooks/useUser";
import ActionsBar from "./ActionsBar";
import { BsX } from "react-icons/bs";

/* NOTE:    When on 'By Timeline' tab,
            updating invite response through
            DetailsModal doesn't update styling
            as when on 'By Plan' tab.
*/
interface DetailsModalProps {
    huddle: HuddleTypeForTile | null;
    onClose?: any;
    onRefresh?: any;
    onEditDetails?: (e: any) => Promise<void>;
    onToggleAccept?: (e: any) => Promise<void>;
    onToggleDecline?: (e: any) => Promise<void>;
}

const DetailsModal: React.FC<DetailsModalProps> = ({
    huddle,
    onClose,
    onToggleAccept,
    onToggleDecline,
    onEditDetails,
}) => {
    const { currentUser } = useUser();
    const [huddleVariant, setHuddleVariant] = useState(huddle?.invite_status);
    const container = document.getElementById("details-modal-root");

    return container
        ? createPortal(
              <div
                  data-variant={huddleVariant}
                  className={twMerge(
                      !huddleVariant || huddleVariant === "GOING"
                          ? "themed-darker"
                          : "themed",
                      "absolute overflow-clip top-0 h-full left-0 right-0 rounded-3xl flex flex-col",
                      "bg-[var(--500)] border-4 border-[var(--600)] [&_.section]:bg-[var(--400)]",
                      "[&_>_.section:not(:last-of-type)]:border-b-2 [&_>_.section]:border-inherit [&_>_.section]:transition-colors"
                  )}
              >
                  {huddle && (
                      <>
                          <div className='section border-none w-full flex justify-center items-center p-4 gap-2'>
                              <p className='text text-sm text-center text-white/75 hover:text-white font-medium cursor-pointer'>{`@${huddle.author.username}`}</p>
                          </div>

                          <div
                              id='header'
                              className='section flex flex-col p-4'
                          >
                              <div id='header-title' className='w-full flex'>
                                  <p className='text text-2xl text-white font-bold pb-6'>
                                      {huddle.title}
                                  </p>
                              </div>
                              <div
                                  id='header-time'
                                  className='w-full flex justify-stretch'
                              >
                                  <div className='w-full flex'>
                                      <div className='w-full flex items-baseline gap-4'>
                                          <p className='text text-sm font-bold text-white/50'>
                                              from
                                          </p>
                                          <p className='text text-xl font-bold text-white w-full'>
                                              {dateFormat(
                                                  huddle.start_time,
                                                  "h:MMtt"
                                              )}
                                          </p>
                                      </div>
                                      <div className='w-full flex items-baseline gap-4'>
                                          <p className='text text-sm font-bold text-white/50'>
                                              to
                                          </p>
                                          <p className='text text-xl font-bold text-white w-full'>
                                              {huddle.end_time
                                                  ? dateFormat(
                                                        huddle.end_time,
                                                        "h:MMtt"
                                                    )
                                                  : "?"}
                                          </p>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          {huddle.location && (
                              <div className='section flex flex-col p-4 cursor-pointer [&.section:hover]:brightness-[1.1] transition-all'>
                                  <a
                                      href=''
                                      target={"_blank"}
                                      onClick={(e) => e.stopPropagation()}
                                      className='location w-fit flex gap-1 items-center  [&_>_svg_path]:stroke-white/80 [&:hover_>_svg_path]:stroke-white [&:hover_>_p]:text-white'
                                  >
                                      <GrLocation size={24} />
                                      <p className='text-white/80 text-sm font-medium'>
                                          {huddle.location.display}
                                      </p>
                                  </a>
                              </div>
                          )}

                          {huddle.invite_list && (
                              <div className='section flex flex-col p-4 cursor-pointer [&.section:hover]:brightness-[1.1] transition-all'>
                                  <AvatarList
                                      inviteList={[
                                          {
                                              status: "GOING",
                                              user: huddle.author,
                                              huddle_id: huddle._id,
                                              created_at: huddle.created_at,
                                          },
                                          ...huddle.invite_list,
                                      ]}
                                  />
                              </div>
                          )}

                          <div className='section mt-auto'>
                              <ActionsBar
                                  huddleVariant={huddleVariant}
                                  onToggleAccept={
                                      huddleVariant ? onToggleAccept : undefined
                                  }
                                  onToggleDecline={
                                      huddleVariant
                                          ? onToggleDecline
                                          : undefined
                                  }
                                  onEditDetails={
                                      !huddleVariant ? onEditDetails : undefined
                                  }
                              />
                          </div>
                      </>
                  )}

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
                              (!huddle?.invite_status ||
                                  huddle?.invite_status === "GOING") &&
                                  "stroke-[var(--700)] fill-[var(--700)]"
                          )}
                      />
                  </button>
              </div>,
              container
          )
        : null;
};

export default DetailsModal;
