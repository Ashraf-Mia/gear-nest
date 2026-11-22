"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  RefreshCw,
  Search,
  TriangleAlert,
  User as UserIcon,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllUsers, updateUserRole } from "@/lib/api/admin";
import { formatDate } from "@/lib/format";
import type { TAdminUser, TRole } from "@/types";

import AdminPageGuard from "../_components/admin-page-guard";

const ROLES: TRole[] = ["customer", "owner", "admin"];

const selectClass =
  "h-9 w-full min-w-[7.5rem] rounded-md border border-input bg-background px-2 text-sm capitalize outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60";

export default function AdminUsersPage() {
  return (
    <AdminPageGuard>
      <AdminUsersTable />
    </AdminPageGuard>
  );
}

function AdminUsersTable() {
  const [users, setUsers] = useState<TAdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [savingId, setSavingId] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isCancelled = false;

    const loadUsers = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await getAllUsers();

        if (!isCancelled) {
          setUsers(data);
        }
      } catch (cause) {
        if (!isCancelled) {
          setUsers([]);
          setError(
            cause instanceof Error ? cause.message : "Could not load users.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isCancelled = true;
    };
  }, [reloadKey]);

  const adminCount = users.filter((user) => user.role === "admin").length;

  const term = search.trim().toLowerCase();
  const visibleUsers = term
    ? users.filter(
        (user) =>
          (user.name ?? "").toLowerCase().includes(term) ||
          (user.email ?? "").toLowerCase().includes(term),
      )
    : users;

  const handleRoleChange = async (user: TAdminUser, role: TRole) => {
    if (role === user.role) return;

    setSavingId(user._id);

    try {
      const updated = await updateUserRole(user._id, role);

      setUsers((items) =>
        items.map((item) =>
          item._id === user._id ? { ...item, ...updated } : item,
        ),
      );

      toast.success("Role updated", {
        description: `${user.name || user.email} is now ${role}.`,
      });
    } catch (cause) {
      toast.error("Could not update the role", {
        description:
          cause instanceof Error ? cause.message : "Please try again.",
      });
    } finally {
      setSavingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">All Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every registered account. Changing a role changes which dashboard the
          user can open.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email..."
            className="h-10 pl-9"
            aria-label="Search users"
          />
        </div>

        {!isLoading && !error && (
          <p className="text-sm text-muted-foreground">
            {visibleUsers.length} of {users.length}{" "}
            {users.length === 1 ? "user" : "users"}
          </p>
        )}
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-3 py-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <TriangleAlert className="size-5" />
            </span>
            <div>
              <p className="font-medium">Could not load users</p>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              <RefreshCw className="size-4" />
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : users.length === 0 ? (
        <Empty className="border border-dashed bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users />
            </EmptyMedia>
            <EmptyTitle>No users yet</EmptyTitle>
            <EmptyDescription>
              Accounts appear here as soon as people register.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : visibleUsers.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          No user matches &ldquo;{search}&rdquo;.
        </p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Registered Accounts</CardTitle>
            <CardDescription>
              {adminCount === 1
                ? "There is one admin. It cannot be demoted."
                : `${adminCount} admins.`}
            </CardDescription>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Registered</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {visibleUsers.map((user) => {
                  const isLastAdmin = user.role === "admin" && adminCount === 1;

                  return (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="size-9 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                            {user.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={user.image}
                                alt=""
                                loading="lazy"
                                className="size-full object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center text-muted-foreground">
                                <UserIcon className="size-4" />
                              </div>
                            )}
                          </div>

                          <p className="min-w-0 truncate font-medium">
                            {user.name || "Unnamed user"}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <select
                            className={selectClass}
                            value={user.role}
                            disabled={savingId === user._id || isLastAdmin}
                            title={
                              isLastAdmin
                                ? "The last admin cannot be demoted"
                                : undefined
                            }
                            aria-label={`Role for ${user.name || user.email}`}
                            onChange={(event) =>
                              handleRoleChange(
                                user,
                                event.target.value as TRole,
                              )
                            }
                          >
                            {ROLES.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>

                          {savingId === user._id && (
                            <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
