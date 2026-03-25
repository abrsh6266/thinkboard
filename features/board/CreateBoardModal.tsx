"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useCreateBoard } from "@/hooks/useBoards";
import { useUIStore } from "@/store/ui-store";
import { FormEvent, useState } from "react";

export function CreateBoardModal() {
  const open = useUIStore((state) => state.createBoardOpen);
  const setOpen = useUIStore((state) => state.setCreateBoardOpen);
  const [name, setName] = useState("");
  const mutation = useCreateBoard();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await mutation.mutateAsync(name.trim());
    setName("");
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)} title="Create Board">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Board Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sprint Planning"
          autoFocus
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create Board"}
        </Button>
      </form>
    </Modal>
  );
}
