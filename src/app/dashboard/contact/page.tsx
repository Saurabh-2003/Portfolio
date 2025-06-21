"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Mail,
  Phone,
  Linkedin,
  Github,
  Eye,
  EyeOff,
  User,
  MessageSquare,
  ExternalLink,
  CheckCircle,
  Settings,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ContactInfo, ContactFormData, ContactMessage } from "@/types";
import {
  getContactInfo,
  createOrUpdateContactInfo,
  getContactMessages,
  markMessageAsRead,
  markMessageAsUnread,
  deleteContactMessage,
  bulkMarkMessagesAsRead,
  bulkDeleteMessages,
} from "@/lib/actions/contact";

type MessageFilter = "all" | "read" | "unread";

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageFilter, setMessageFilter] = useState<MessageFilter>("all");
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [isContactInfoDialogOpen, setIsContactInfoDialogOpen] = useState(false);
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(
    null,
  );
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    email: "",
    phone: "",
    linkedin: "",
    github: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [contactInfoData, messagesData] = await Promise.all([
        getContactInfo(),
        getContactMessages(),
      ]);
      setContactInfo(contactInfoData);
      setMessages(messagesData);
    } catch (error) {
      toast.error("Failed to load contact data");
      console.error("Error loading contact data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      messageFilter === "all" ||
      (messageFilter === "read" && message.is_read) ||
      (messageFilter === "unread" && !message.is_read);

    return matchesSearch && matchesFilter;
  });

  const handleEditContactInfo = () => {
    if (contactInfo) {
      setContactFormData({
        email: contactInfo.email || "",
        phone: contactInfo.phone || "",
        linkedin: contactInfo.linkedin || "",
        github: contactInfo.github || "",
      });
    }
    setIsContactInfoDialogOpen(true);
  };

  const handleSubmitContactInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await createOrUpdateContactInfo(contactFormData);
      if (result.success) {
        toast.success(result.message);
        setIsContactInfoDialogOpen(false);
        await loadData();
      } else {
        toast.error(result.error || "Failed to save contact information");
      }
    } catch (error) {
      toast.error("An error occurred while saving contact information");
      console.error("Error saving contact info:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewMessage = async (message: ContactMessage) => {
    setViewingMessage(message);
    if (!message.is_read) {
      try {
        await markMessageAsRead(message.id as string);
        await loadData();
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
  };

  const handleToggleMessageRead = async (
    messageId: string,
    isRead: boolean,
  ) => {
    try {
      if (isRead) {
        await markMessageAsUnread(messageId);
      } else {
        await markMessageAsRead(messageId);
      }
      await loadData();
      toast.success(`Message marked as ${isRead ? "unread" : "read"}`);
    } catch (error) {
      toast.error("Failed to update message status");
      console.error("Error updating message status:", error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const result = await deleteContactMessage(messageId);
      if (result.success) {
        toast.success(result.message);
        await loadData();
      } else {
        toast.error(result.error || "Failed to delete message");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the message");
      console.error("Error deleting message:", error);
    }
  };

  const handleSelectMessage = (messageId: string, checked: boolean) => {
    if (checked) {
      setSelectedMessages([...selectedMessages, messageId]);
    } else {
      setSelectedMessages(selectedMessages.filter((id) => id !== messageId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMessages(filteredMessages.map((msg) => String(msg.id)));
    } else {
      setSelectedMessages([]);
    }
  };

  const handleBulkMarkAsRead = async () => {
    try {
      const result = await bulkMarkMessagesAsRead(selectedMessages);
      if (result.success) {
        toast.success(result.message);
        setSelectedMessages([]);
        await loadData();
      } else {
        toast.error(result.error || "Failed to mark messages as read");
      }
    } catch (error) {
      toast.error("An error occurred while updating messages");
      console.error("Error bulk marking as read:", error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const result = await bulkDeleteMessages(selectedMessages);
      if (result.success) {
        toast.success(result.message);
        setSelectedMessages([]);
        await loadData();
      } else {
        toast.error(result.error || "Failed to delete messages");
      }
    } catch (error) {
      toast.error("An error occurred while deleting messages");
      console.error("Error bulk deleting:", error);
    }
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
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-gray-400/10 backdrop-blur-sm">
              <CardHeader>
                <div className="h-6 bg-gray-400/10 rounded w-3/4"></div>
                <div className="h-4 bg-gray-400/10 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-400/10 rounded"></div>
                  <div className="h-4 bg-gray-400/10 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const unreadCount = messages.filter((msg) => !msg.is_read).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Contact Management
          </h1>
          <p className="text-muted-foreground">
            Manage your contact information and messages ({messages.length}{" "}
            total
            {unreadCount > 0 && `, ${unreadCount} unread`})
          </p>
        </div>
        <Button onClick={handleEditContactInfo}>
          <Settings className="mr-2 h-4 w-4" />
          Update Contact Info
        </Button>
      </div>

      {/* Contact Information Card */}
      <Card className="bg-gradient-to-br from-gray-400/10 to-gray-500/5 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Your public contact information displayed on the portfolio
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleEditContactInfo}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {contactInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 dark:bg-blue-400/10 dark:border-blue-400/20">
                  <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {contactInfo.email}
                  </p>
                </div>
              </div>
              {contactInfo.phone && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 dark:bg-green-400/10 dark:border-green-400/20">
                    <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {contactInfo.phone}
                    </p>
                  </div>
                </div>
              )}
              {contactInfo.linkedin && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-700/10 border border-blue-700/20 dark:bg-blue-600/10 dark:border-blue-600/20">
                    <Linkedin className="h-4 w-4 text-blue-700 dark:text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">LinkedIn</p>
                    <a
                      href={contactInfo.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      View Profile <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
              {contactInfo.github && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-500/10 border border-gray-500/20 dark:bg-gray-400/10 dark:border-gray-400/20">
                    <Github className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">GitHub</p>
                    <a
                      href={contactInfo.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      View Profile <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No contact information set
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your contact information to display on your portfolio
              </p>
              <Button onClick={handleEditContactInfo} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Contact Information
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Messages Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Contact Messages</h2>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          {selectedMessages.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkMarkAsRead}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Read ({selectedMessages.length})
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected ({selectedMessages.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Messages</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectedMessages.length}{" "}
                      selected message(s)? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleBulkDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Messages
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
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
          {filteredMessages.length > 0 && (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={
                  selectedMessages.length === filteredMessages.length &&
                  filteredMessages.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">Select All</span>
            </div>
          )}
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
                    <div className="flex items-start gap-3 flex-1">
                      <Checkbox
                        checked={selectedMessages.includes(String(message.id))}
                        onCheckedChange={(checked) =>
                          handleSelectMessage(
                            String(message.id),
                            checked as boolean,
                          )
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
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
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{message.name}</span>
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
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleMessageRead(
                            String(message.id),
                            message.is_read,
                          );
                        }}
                        className="h-8 w-8 p-0"
                      >
                        {message.is_read ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
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
                              onClick={() =>
                                handleDeleteMessage(String(message.id))
                              }
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
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {message.message}
                  </p>
                </CardContent>
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
      </div>

      {/* Contact Info Dialog */}
      <Dialog
        open={isContactInfoDialogOpen}
        onOpenChange={setIsContactInfoDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-gray-400/10 to-gray-500/5 backdrop-blur-sm border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Update Contact Information
            </DialogTitle>
            <DialogDescription>
              Update your contact details that will be displayed on your
              portfolio
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitContactInfo} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={contactFormData.email}
                  onChange={(e) =>
                    setContactFormData({
                      ...contactFormData,
                      email: e.target.value,
                    })
                  }
                  placeholder="your.email@example.com"
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contactFormData.phone || ""}
                  onChange={(e) =>
                    setContactFormData({
                      ...contactFormData,
                      phone: e.target.value,
                    })
                  }
                  placeholder="+1 (555) 123-4567"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-sm font-medium">
                  LinkedIn Profile
                </Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={contactFormData.linkedin || ""}
                  onChange={(e) =>
                    setContactFormData({
                      ...contactFormData,
                      linkedin: e.target.value,
                    })
                  }
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github" className="text-sm font-medium">
                  GitHub Profile
                </Label>
                <Input
                  id="github"
                  type="url"
                  value={contactFormData.github || ""}
                  onChange={(e) =>
                    setContactFormData({
                      ...contactFormData,
                      github: e.target.value,
                    })
                  }
                  placeholder="https://github.com/yourusername"
                  className="h-11"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsContactInfoDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Contact Info"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Message View Dialog */}
      <Dialog
        open={!!viewingMessage}
        onOpenChange={() => setViewingMessage(null)}
      >
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-gray-400/10 to-gray-500/5 backdrop-blur-sm border shadow-2xl">
          {viewingMessage && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {viewingMessage.subject}
                </DialogTitle>
                <DialogDescription>
                  Message from {viewingMessage.name} •{" "}
                  {formatDate(viewingMessage.created_at!)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-gray-400/10 backdrop-blur-sm rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{viewingMessage.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <a
                      href={`mailto:${viewingMessage.email}`}
                      className="text-primary hover:underline"
                    >
                      {viewingMessage.email}
                    </a>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Message</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {viewingMessage.message}
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(`mailto:${viewingMessage.email}`)
                    }
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Reply
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleToggleMessageRead(
                        String(viewingMessage.id),
                        viewingMessage.is_read,
                      )
                    }
                  >
                    {viewingMessage.is_read ? (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Mark as Unread
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Mark as Read
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
