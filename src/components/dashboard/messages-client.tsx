"use client";

import { useEffect, useState, useCallback } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  Trash2,
  MailOpen,
  Mail,
  User,
  Clock,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { ContactMessage } from "@/types";

const PAGE_SIZE = 10;

async function fetchMessages(page: number): Promise<{
  messages: ContactMessage[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}> {
  try {
    const res = await fetch(`/api/messages?page=${page}&pageSize=${PAGE_SIZE}`);
    if (!res.ok) {
      throw new Error("Failed to fetch messages");
    }
    return res.json();
  } catch (err) {
    console.error("Error fetching messages:", err);
    return {
      messages: [],
      total: 0,
      totalPages: 1,
      page,
      pageSize: PAGE_SIZE,
    };
  }
}

async function markMessageAsRead(id: string | number): Promise<boolean> {
  try {
    const res = await fetch(`/api/messages/mark-read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function deleteMessage(id: string | number): Promise<boolean> {
  try {
    const res = await fetch(`/api/messages/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

type MessageFilter = "all" | "read" | "unread";

export default function MessagesClient() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>(
    [],
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [messageFilter, setMessageFilter] = useState<MessageFilter>("all");
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMessages(page);
      setMessages(data.messages);
      setTotalPages(data.totalPages);
      setTotalMessages(data.total);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    // Filter messages based on search and filter
    let filtered = messages;

    if (searchTerm) {
      filtered = filtered.filter(
        (message) =>
          message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.message.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (messageFilter !== "all") {
      filtered = filtered.filter((message) =>
        messageFilter === "read" ? message.is_read : !message.is_read,
      );
    }

    setFilteredMessages(filtered);
  }, [messages, searchTerm, messageFilter]);

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      const success = await markMessageAsRead(message.id);
      if (success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === message.id ? { ...m, is_read: true } : m)),
        );
        toast.success("Message marked as read");
      }
    }
  };

  const handleDeleteMessage = async (messageId: string | number) => {
    setDeletingId(messageId);
    const success = await deleteMessage(messageId);
    if (success) {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      toast.success("Message deleted successfully");
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } else {
      toast.error("Failed to delete message");
    }
    setDeletingId(null);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const unreadCount = messages.filter((msg) => !msg.is_read).length;

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-400/10 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-400/10 rounded w-48"></div>
          </div>
          <div className="h-10 bg-gray-400/10 rounded w-32"></div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="bg-gray-400/10 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-400/10 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-400/10 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-400/10 rounded w-1/2"></div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Messages
          </h1>
          <p className="text-muted-foreground">
            Contact messages from your portfolio ({totalMessages} total
            {unreadCount > 0 && `, ${unreadCount} unread`})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} unread
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 backdrop-blur-sm border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalMessages}
            </div>
            <p className="text-xs text-muted-foreground">
              All time contact messages
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/5 to-green-600/5 backdrop-blur-sm border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read Messages</CardTitle>
            <MailOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {totalMessages - unreadCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalMessages > 0
                ? `${Math.round(((totalMessages - unreadCount) / totalMessages) * 100)}% read rate`
                : "No messages yet"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/5 to-orange-600/5 backdrop-blur-sm border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unread Messages
            </CardTitle>
            <Mail className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {unreadCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Require your attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-400/10 backdrop-blur-sm"
          />
        </div>
        <Select
          value={messageFilter}
          onValueChange={(value) => setMessageFilter(value as MessageFilter)}
        >
          <SelectTrigger className="w-[180px] bg-gray-400/10 backdrop-blur-sm">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter messages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Messages</SelectItem>
            <SelectItem value="unread">Unread Only</SelectItem>
            <SelectItem value="read">Read Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <Card
              key={message.id}
              className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${
                !message.is_read
                  ? "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 backdrop-blur-sm"
                  : "bg-gradient-to-br from-gray-400/10 to-gray-500/5 border-border/50 backdrop-blur-sm"
              }`}
              onClick={() => handleViewMessage(message)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(message.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle
                          className={`text-lg line-clamp-1 ${
                            !message.is_read ? "font-bold" : "font-semibold"
                          }`}
                        >
                          {message.subject}
                        </CardTitle>
                        {!message.is_read && (
                          <Badge variant="destructive" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{message.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{message.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(message.created_at!)}</span>
                        </div>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {message.message}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewMessage(message);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          disabled={deletingId === message.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gradient-to-br from-gray-400/10 to-gray-500/5 backdrop-blur-sm border shadow-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Message</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this message from
                            &quot;{message.name}&quot;? This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteMessage(message.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        ) : (
          <Card className="bg-gray-400/10 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {searchTerm || messageFilter !== "all"
                  ? "No messages found"
                  : "No messages yet"}
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                {searchTerm || messageFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Messages sent through your portfolio contact form will appear here"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({totalMessages} total messages)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Message View Dialog */}
      <Dialog
        open={!!selectedMessage}
        onOpenChange={() => setSelectedMessage(null)}
      >
        <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-gray-400/10 to-gray-500/5 backdrop-blur-sm border shadow-2xl">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  {selectedMessage.subject}
                </DialogTitle>
                <DialogDescription>
                  Message from {selectedMessage.name} •{" "}
                  {formatDate(selectedMessage.created_at!)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Sender Info */}
                <div className="flex items-center gap-4 p-4 bg-gray-400/10 backdrop-blur-sm rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(selectedMessage.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{selectedMessage.name}</h4>
                      {!selectedMessage.is_read && (
                        <Badge variant="destructive" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Mail className="h-4 w-4" />
                        {selectedMessage.email}
                      </a>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDate(selectedMessage.created_at!)}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Message Content */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Message Content
                  </h4>
                  <div className="p-4 bg-gray-400/10 backdrop-blur-sm rounded-lg">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(`mailto:${selectedMessage.email}`)
                    }
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Reply via Email
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        disabled={deletingId === selectedMessage.id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Message
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gradient-to-br from-gray-400/10 to-gray-500/5 backdrop-blur-sm border shadow-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Message</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this message from
                          &quot;{selectedMessage.name}&quot;? This action cannot
                          be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            handleDeleteMessage(selectedMessage.id);
                            setSelectedMessage(null);
                          }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Message
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
