import { CSSProperties } from "react";
import { TableShape } from "../types/table";

type SeatPositionVariant = "grid" | "modal";

type SeatPosition = CSSProperties;

const getHorizontalLeft = (index: number, count: number) => {
  if (count <= 1) {
    return "50%";
  }

  const percentage = (index * 100) / (count - 1);
  return `${percentage}%`;
};

export const getSeatPositions = (
  seatCount: number,
  shape: TableShape,
  variant: SeatPositionVariant = "grid"
): SeatPosition[] => {
  const offset = variant === "grid" ? 14 : 32;
  const seatPositions: SeatPosition[] = [];

  if (shape === "small") {
    seatPositions.push({
      top: -offset,
      left: "50%",
      transform: "translateX(-50%)",
    });
    seatPositions.push({
      bottom: -offset,
      left: "50%",
      transform: "translateX(-50%)",
    });
    return seatPositions.slice(0, seatCount);
  }

  if (shape === "large") {
    const topCount = Math.ceil(seatCount / 2);
    const bottomCount = seatCount - topCount;

    for (let i = 0; i < topCount; i += 1) {
      seatPositions.push({
        top: -offset,
        left: getHorizontalLeft(i, topCount),
        transform: "translateX(-50%)",
      });
    }

    for (let i = 0; i < bottomCount; i += 1) {
      seatPositions.push({
        bottom: -offset,
        left: getHorizontalLeft(i, bottomCount || 1),
        transform: "translateX(-50%)",
      });
    }

    return seatPositions;
  }

  const topCount = Math.ceil(seatCount / 2);
  const bottomCount = seatCount - topCount;

  for (let i = 0; i < topCount; i += 1) {
    seatPositions.push({
      top: -offset,
      left: getHorizontalLeft(i, topCount),
      transform: "translateX(-50%)",
    });
  }

  for (let i = 0; i < bottomCount; i += 1) {
    seatPositions.push({
      bottom: -offset,
      left: getHorizontalLeft(i, bottomCount || 1),
      transform: "translateX(-50%)",
    });
  }

  return seatPositions;
};
