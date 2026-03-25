"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useJoinBoard } from "@/hooks/useBoards";
import { useUIStore } from "@/store/ui-store";
import { FormEvent, useState } from "react";

export function JoinBoardModal() {
  const open = useUIStore((state) => state.joinBoardOpen);
  const setOpen = useUIStore((state) => state.setJoinBoardOpen);
  const [boardId, setBoardId] = useState("");
  const [error, setError] = useState("");
  const mutation = useJoinBoard();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!boardId.trim()) return;
    try {
      await mutation.mutateAsync(boardId.trim());
      setBoardId("");
      setOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };
  return (
    <Modal open={open} onClose={() => setOpen(false)} title="Join Board">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Board ID"
          value={boardId}
          onChange={(e) => setBoardId(e.target.value)}
          placeholder="Pastr board ID here"
          autoFocus
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Joining..." : "Join Board"}
        </Button>
      </form>
    </Modal>
  );
}
