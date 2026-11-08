"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { PageBlock } from "@/db/schema";

interface UseBentoDndProps {
  blocks: PageBlock[];
  onReorderBlocks: (newBlocks: PageBlock[]) => void;
  onSelectBlock: (block: PageBlock) => void;
}

export function useBentoDnd({
  blocks,
  onReorderBlocks,
  onSelectBlock,
}: UseBentoDndProps) {
  // Drag and Drop States
  const [draggedBlock, setDraggedBlock] = useState<PageBlock | null>(null);
  const [previewBlocks, setPreviewBlocks] = useState<PageBlock[] | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [ghostSize, setGhostSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // Tracking Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const addBlockPlaceholderRef = useRef<HTMLDivElement>(null);
  const blockElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  const autoScrollRafRef = useRef<number | null>(null);
  const autoScrollSpeedRef = useRef<number>(0);
  const lastPointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const handlePointerMoveCoordsRef = useRef<((x: number, y: number) => void) | null>(null);
  const previewBlocksRef = useRef<PageBlock[] | null>(null);
  const prevRectsRef = useRef<Map<string, DOMRect>>(new Map());
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dwellTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingTargetIdRef = useRef<string | null>(null);
  const startPointerPosRef = useRef<{ x: number; y: number } | null>(null);
  const activeCandidateBlockRef = useRef<PageBlock | null>(null);
  const isDraggingRef = useRef(false);
  const justDraggedRef = useRef(false);

  // Stop auto-scroll loop
  const stopAutoScroll = useCallback(() => {
    autoScrollSpeedRef.current = 0;
    if (autoScrollRafRef.current !== null) {
      cancelAnimationFrame(autoScrollRafRef.current);
      autoScrollRafRef.current = null;
    }
  }, []);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
      if (dwellTimerRef.current) clearTimeout(dwellTimerRef.current);
      stopAutoScroll();
    };
  }, [stopAutoScroll]);

  // Register block DOM element
  const registerBlockElement = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      blockElementsRef.current.set(id, el);
    } else {
      blockElementsRef.current.delete(id);
    }
  }, []);

  // Snapshot positions for FLIP animation
  const snapshotPositions = useCallback(() => {
    const rects = new Map<string, DOMRect>();
    blockElementsRef.current.forEach((el, id) => {
      if (el) {
        rects.set(id, el.getBoundingClientRect());
      }
    });
    prevRectsRef.current = rects;
  }, []);

  // FLIP animation effect
  useEffect(() => {
    if (!draggedBlock) return;
    const prevRects = prevRectsRef.current;
    if (!prevRects.size) return;

    blockElementsRef.current.forEach((el, id) => {
      if (!el || id === draggedBlock.id) return;
      const oldRect = prevRects.get(id);
      if (!oldRect) return;

      const newRect = el.getBoundingClientRect();
      const deltaX = oldRect.left - newRect.left;
      const deltaY = oldRect.top - newRect.top;

      if (deltaX !== 0 || deltaY !== 0) {
        // Invert
        el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        el.style.transition = "none";

        // Play
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.transition = "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)";
            el.style.transform = "";
          });
        });
      }
    });
  }, [previewBlocks, draggedBlock]);

  // Start drag function
  const initiateDrag = useCallback(
    (
      block: PageBlock,
      clientX: number,
      clientY: number,
      cardEl: HTMLElement | null
    ) => {
      if (isDraggingRef.current) return;
      isDraggingRef.current = true;
      justDraggedRef.current = false;
      setDraggedBlock(block);

      const initialOrder = [...blocks];
      previewBlocksRef.current = initialOrder;
      setPreviewBlocks(initialOrder);

      if (cardEl) {
        const rect = cardEl.getBoundingClientRect();
        setGhostSize({ width: rect.width, height: rect.height });
        setDragOffset({
          x: Math.min(Math.max(clientX - rect.left, 20), rect.width - 20),
          y: Math.min(Math.max(clientY - rect.top, 20), rect.height - 20),
        });
      } else {
        setGhostSize({ width: 220, height: 140 });
        setDragOffset({ x: 110, y: 70 });
      }

      setCursorPos({ x: clientX, y: clientY });

      if (typeof window !== "undefined" && navigator.vibrate) {
        navigator.vibrate(35);
      }
    },
    [blocks]
  );

  // Auto-scroll edge check
  const checkAutoScroll = useCallback(
    (clientY: number) => {
      const container = scrollContainerRef.current;
      if (!container || !isDraggingRef.current) {
        stopAutoScroll();
        return;
      }

      const rect = container.getBoundingClientRect();
      const topThreshold = rect.top + 90;
      const bottomThreshold = rect.bottom - 90;

      let speed = 0;
      if (clientY < topThreshold) {
        const intensity = Math.min(1, Math.max(0.1, (topThreshold - clientY) / 80));
        speed = -1 * Math.round(4 + intensity * 16);
      } else if (clientY > bottomThreshold) {
        const intensity = Math.min(1, Math.max(0.1, (clientY - bottomThreshold) / 80));
        speed = Math.round(4 + intensity * 16);
      }

      autoScrollSpeedRef.current = speed;

      if (speed !== 0 && autoScrollRafRef.current === null) {
        const scrollLoop = () => {
          if (
            !isDraggingRef.current ||
            !scrollContainerRef.current ||
            autoScrollSpeedRef.current === 0
          ) {
            if (autoScrollRafRef.current !== null) {
              cancelAnimationFrame(autoScrollRafRef.current);
              autoScrollRafRef.current = null;
            }
            return;
          }

          scrollContainerRef.current.scrollTop += autoScrollSpeedRef.current;

          if (handlePointerMoveCoordsRef.current) {
            handlePointerMoveCoordsRef.current(
              lastPointerPosRef.current.x,
              lastPointerPosRef.current.y
            );
          }

          autoScrollRafRef.current = requestAnimationFrame(scrollLoop);
        };

        autoScrollRafRef.current = requestAnimationFrame(scrollLoop);
      } else if (speed === 0 && autoScrollRafRef.current !== null) {
        cancelAnimationFrame(autoScrollRafRef.current);
        autoScrollRafRef.current = null;
      }
    },
    [stopAutoScroll]
  );

  // Core displacement logic
  const handlePointerMoveCoords = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDraggingRef.current || !draggedBlock) return;

      lastPointerPosRef.current = { x: clientX, y: clientY };
      checkAutoScroll(clientY);

      setCursorPos({ x: clientX, y: clientY });
      const currentOrder = previewBlocksRef.current || blocks;
      const currentIndex = currentOrder.findIndex((b) => b.id === draggedBlock.id);

      const ghostCenterX = clientX - dragOffset.x + ghostSize.width / 2;
      const ghostCenterY = clientY - dragOffset.y + ghostSize.height / 2;

      let candidateTargetId: string | null = null;

      // Check bottom placeholder (__end__)
      if (addBlockPlaceholderRef.current) {
        const pRect = addBlockPlaceholderRef.current.getBoundingClientRect();
        if (
          (ghostCenterX >= pRect.left &&
            ghostCenterX <= pRect.right &&
            ghostCenterY >= pRect.top &&
            ghostCenterY <= pRect.bottom) ||
          ghostCenterY > pRect.top
        ) {
          candidateTargetId = "__end__";
        }
      }

      // Check card collision using Euclidean center-distance with hysteresis dead-zone
      if (!candidateTargetId) {
        let minDistance = Infinity;

        for (const [id, element] of blockElementsRef.current.entries()) {
          if (id === draggedBlock.id) continue;
          const rect = element.getBoundingClientRect();

          const hPad = rect.width * 0.15;
          const vPad = rect.height * 0.15;

          const isInsideBuffered =
            ghostCenterX >= rect.left + hPad &&
            ghostCenterX <= rect.right - hPad &&
            ghostCenterY >= rect.top + vPad &&
            ghostCenterY <= rect.bottom - vPad;

          if (isInsideBuffered) {
            const slotCenterX = rect.left + rect.width / 2;
            const slotCenterY = rect.top + rect.height / 2;
            const dist = Math.hypot(ghostCenterX - slotCenterX, ghostCenterY - slotCenterY);

            if (dist < minDistance) {
              minDistance = dist;
              candidateTargetId = id;
            }
          }
        }
      }

      // Validate candidate
      if (!candidateTargetId) {
        if (dwellTimerRef.current) {
          clearTimeout(dwellTimerRef.current);
          dwellTimerRef.current = null;
        }
        pendingTargetIdRef.current = null;
        return;
      }

      if (candidateTargetId === "__end__") {
        const lastIndex = currentOrder.length - 1;
        if (currentIndex === lastIndex) {
          if (dwellTimerRef.current) {
            clearTimeout(dwellTimerRef.current);
            dwellTimerRef.current = null;
          }
          pendingTargetIdRef.current = null;
          return;
        }
      } else {
        const targetIndex = currentOrder.findIndex((b) => b.id === candidateTargetId);
        if (targetIndex === -1 || targetIndex === currentIndex) {
          if (dwellTimerRef.current) {
            clearTimeout(dwellTimerRef.current);
            dwellTimerRef.current = null;
          }
          pendingTargetIdRef.current = null;
          return;
        }
      }

      // Dwell Time Buffer (~140ms)
      if (pendingTargetIdRef.current !== candidateTargetId) {
        pendingTargetIdRef.current = candidateTargetId;
        if (dwellTimerRef.current) {
          clearTimeout(dwellTimerRef.current);
        }

        const targetToExecute = candidateTargetId;
        dwellTimerRef.current = setTimeout(() => {
          if (!isDraggingRef.current || !draggedBlock) return;
          const orderNow = previewBlocksRef.current || blocks;
          const fromIdx = orderNow.findIndex((b) => b.id === draggedBlock.id);

          if (targetToExecute === "__end__") {
            if (fromIdx !== -1 && fromIdx !== orderNow.length - 1) {
              snapshotPositions();
              const nextOrder = [...orderNow];
              const [moved] = nextOrder.splice(fromIdx, 1);
              nextOrder.push(moved);
              previewBlocksRef.current = nextOrder;
              setPreviewBlocks(nextOrder);
              if (typeof window !== "undefined" && navigator.vibrate) {
                navigator.vibrate(20);
              }
            }
          } else {
            const toIdx = orderNow.findIndex((b) => b.id === targetToExecute);
            if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
              snapshotPositions();
              const nextOrder = [...orderNow];
              const [moved] = nextOrder.splice(fromIdx, 1);
              nextOrder.splice(toIdx, 0, moved);
              previewBlocksRef.current = nextOrder;
              setPreviewBlocks(nextOrder);
              if (typeof window !== "undefined" && navigator.vibrate) {
                navigator.vibrate(20);
              }
            }
          }
          dwellTimerRef.current = null;
        }, 140);
      }
    },
    [blocks, checkAutoScroll, dragOffset, draggedBlock, ghostSize, snapshotPositions]
  );

  useEffect(() => {
    handlePointerMoveCoordsRef.current = handlePointerMoveCoords;
  }, [handlePointerMoveCoords]);

  // Finish drag
  const finishDrag = useCallback(() => {
    stopAutoScroll();

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (dwellTimerRef.current) {
      clearTimeout(dwellTimerRef.current);
      dwellTimerRef.current = null;
    }

    if (isDraggingRef.current && draggedBlock) {
      justDraggedRef.current = true;
      setTimeout(() => {
        justDraggedRef.current = false;
      }, 200);

      if (pendingTargetIdRef.current) {
        const orderNow = previewBlocksRef.current || blocks;
        const fromIdx = orderNow.findIndex((b) => b.id === draggedBlock.id);
        if (pendingTargetIdRef.current === "__end__") {
          if (fromIdx !== -1 && fromIdx !== orderNow.length - 1) {
            const nextOrder = [...orderNow];
            const [moved] = nextOrder.splice(fromIdx, 1);
            nextOrder.push(moved);
            previewBlocksRef.current = nextOrder;
          }
        } else {
          const toIdx = orderNow.findIndex((b) => b.id === pendingTargetIdRef.current);
          if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
            const nextOrder = [...orderNow];
            const [moved] = nextOrder.splice(fromIdx, 1);
            nextOrder.splice(toIdx, 0, moved);
            previewBlocksRef.current = nextOrder;
          }
        }
      }

      const finalOrder = previewBlocksRef.current;
      if (finalOrder) {
        const hasOrderChanged = finalOrder.some((b, i) => b.id !== blocks[i]?.id);
        if (hasOrderChanged) {
          onReorderBlocks(finalOrder);
          if (typeof window !== "undefined" && navigator.vibrate) {
            navigator.vibrate(35);
          }
        }
      }
    } else if (activeCandidateBlockRef.current && !justDraggedRef.current) {
      onSelectBlock(activeCandidateBlockRef.current);
    }

    isDraggingRef.current = false;
    setDraggedBlock(null);
    setPreviewBlocks(null);
    previewBlocksRef.current = null;
    pendingTargetIdRef.current = null;
    startPointerPosRef.current = null;
    activeCandidateBlockRef.current = null;
  }, [blocks, draggedBlock, onReorderBlocks, onSelectBlock, stopAutoScroll]);

  // Cancel drag
  const cancelDrag = useCallback(() => {
    stopAutoScroll();

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (dwellTimerRef.current) {
      clearTimeout(dwellTimerRef.current);
      dwellTimerRef.current = null;
    }

    isDraggingRef.current = false;
    setDraggedBlock(null);
    setPreviewBlocks(null);
    previewBlocksRef.current = null;
    pendingTargetIdRef.current = null;
    startPointerPosRef.current = null;
    activeCandidateBlockRef.current = null;
  }, [stopAutoScroll]);

  // Global window listeners during active drag
  useEffect(() => {
    if (!draggedBlock) return;

    const handleGlobalPointerMove = (e: PointerEvent) => {
      handlePointerMoveCoords(e.clientX, e.clientY);
    };

    const handleGlobalPointerUp = () => {
      finishDrag();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelDrag();
      }
    };

    window.addEventListener("pointermove", handleGlobalPointerMove, { passive: true });
    window.addEventListener("pointerup", handleGlobalPointerUp);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [draggedBlock, handlePointerMoveCoords, finishDrag, cancelDrag]);

  // Prevent browser touch-scroll during drag
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingRef.current && e.cancelable) {
        e.preventDefault();
      }
    };

    window.addEventListener("touchmove", handleTouchMove, {
      passive: false,
      capture: true,
    });

    return () => {
      window.removeEventListener("touchmove", handleTouchMove, { capture: true });
    };
  }, []);

  // Lock body scroll when dragging
  useEffect(() => {
    if (!draggedBlock) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
      stopAutoScroll();
    };
  }, [draggedBlock, stopAutoScroll]);

  // Card pointer event handlers
  const handlePointerDown = (
    block: PageBlock,
    e: React.PointerEvent<HTMLDivElement>,
    isFromHandle = false
  ) => {
    if (e.button !== 0) return;

    const target = e.target as HTMLElement | null;
    if (
      !isFromHandle &&
      (target?.closest("button") || target?.closest("a") || target?.closest("input"))
    ) {
      return;
    }

    startPointerPosRef.current = { x: e.clientX, y: e.clientY };
    activeCandidateBlockRef.current = block;
    isDraggingRef.current = false;
    justDraggedRef.current = false;

    const cardEl =
      (e.currentTarget.closest("[data-block-id]") as HTMLElement) || e.currentTarget;

    if (isFromHandle) {
      e.stopPropagation();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      initiateDrag(block, e.clientX, e.clientY, cardEl);
      return;
    }

    if (e.pointerType === "touch") {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = setTimeout(() => {
        try {
          cardEl.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
        initiateDrag(block, e.clientX, e.clientY, cardEl);
      }, 250);
    }
  };

  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) {
      if (startPointerPosRef.current && activeCandidateBlockRef.current) {
        const dist = Math.hypot(
          e.clientX - startPointerPosRef.current.x,
          e.clientY - startPointerPosRef.current.y
        );

        // Require at least 14px of movement to differentiate intentional drag from a click
        if (e.pointerType === "mouse" && dist > 14) {
          const cardEl =
            (e.currentTarget.closest("[data-block-id]") as HTMLElement) || e.currentTarget;
          initiateDrag(
            activeCandidateBlockRef.current,
            e.clientX,
            e.clientY,
            cardEl
          );
        } else if (e.pointerType === "touch" && dist > 10) {
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
        }
      }
      return;
    }

    handlePointerMoveCoords(e.clientX, e.clientY);
  };

  const handleCardPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // fallback
    }

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    const target = e.target as HTMLElement | null;
    const isToolbarAction = target?.closest("button") || target?.closest("[role='tooltip']");

    if (
      !isToolbarAction &&
      !isDraggingRef.current &&
      activeCandidateBlockRef.current &&
      !justDraggedRef.current
    ) {
      onSelectBlock(activeCandidateBlockRef.current);
    }
    activeCandidateBlockRef.current = null;
  };

  const handleCardPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // fallback
    }

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    activeCandidateBlockRef.current = null;
  };

  const wasJustDragged = useCallback(() => justDraggedRef.current, []);

  const displayBlocks = previewBlocks ?? blocks;
  const isDraggingAtEnd =
    draggedBlock !== null &&
    displayBlocks.length > 0 &&
    displayBlocks[displayBlocks.length - 1]?.id === draggedBlock.id;

  return {
    draggedBlock,
    displayBlocks,
    cursorPos,
    dragOffset,
    ghostSize,
    scrollContainerRef,
    addBlockPlaceholderRef,
    registerBlockElement,
    handlePointerDown,
    handleCardPointerMove,
    handleCardPointerUp,
    handleCardPointerCancel,
    wasJustDragged,
    isDraggingAtEnd,
  };
}
