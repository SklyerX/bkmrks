import {
  BookmarkEntrySchema,
  type BookmarkEntryWithId,
  type BookmarkEntry,
} from "@/lib/validators/add-bookmark";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/use-debounce";
import { z } from "zod";
import { useParams } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { addBookmarkAction } from "../_actions/add-bookmark";
import { updateBookmarkAction } from "../_actions/update-bookmark";
import { toast } from "sonner";

interface Props {
  bookmark?: BookmarkEntryWithId;
  onCompleted: () => void;
}

export default function BookmarkForm({ bookmark, onCompleted }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const { sectionId } = useParams();

  const isEditMode = !!bookmark;

  const addBookmark = useAction(addBookmarkAction);
  const updateBookmark = useAction(updateBookmarkAction);

  const debounceFetch = useDebounce(async (value: string) => {
    if (z.string().url().safeParse(value).success === false) return;

    setLoading(true);
    const { data } = await axios.get(`/api/metadata?url=${value}`);

    form.setValue("name", data.title);
    form.setValue("description", data.description);
    form.setValue("favicon", data.favicon);
    form.setValue("url", value);

    setLoading(false);
  }, 500);

  const getDefaultValues = () => ({
    name: bookmark?.name || "",
    url: bookmark?.url || "",
    description: bookmark?.description || "",
    favicon: bookmark?.favicon || "",
    folderId: Array.isArray(sectionId) ? sectionId[0] : sectionId || "",
    isStarred: bookmark?.isStarred || false,
  });

  const form = useForm<BookmarkEntry>({
    resolver: zodResolver(BookmarkEntrySchema),
    defaultValues: getDefaultValues(),
  });

  const handleSubmit = (data: BookmarkEntry) => {
    if (isEditMode) {
      updateBookmark.execute({
        ...data,
        id: bookmark.id,
      });

      return;
    }

    addBookmark.execute(data);
  };

  useEffect(() => {
    if (addBookmark.status === "hasSucceeded") {
      toast.success("Bookmark created successfully");
      onCompleted();
    }
    if (updateBookmark.status === "hasSucceeded") {
      toast.success("Bookmark updated successfully");
      onCompleted();
    }
  }, [addBookmark.status, updateBookmark.status]);

  useEffect(() => {
    if (addBookmark.status === "hasErrored") {
      toast.error("Failed to create bookmark", {
        description: addBookmark.result.serverError || "Something went wrong!",
      });
    }
    if (updateBookmark.status === "hasErrored") {
      toast.error("Failed to update bookmark", {
        description:
          updateBookmark.result.serverError || "Something went wrong!",
      });
    }
  }, [
    addBookmark.status,
    addBookmark.result,
    updateBookmark.status,
    updateBookmark.result,
  ]);

  const renderForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex items-center gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel />
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel />
                <FormControl>
                  <Input placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel />
              <FormControl>
                <Input placeholder="https://" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="favicon"
          render={({ field }) => (
            <FormItem>
              <FormLabel />
              <FormControl>
                <Input
                  placeholder="https://example.com/favicon.ico"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isStarred"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Star</FormLabel>
                <FormDescription>
                  Save this bookmark to your starred bookmarks
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mt-5"
          disabled={
            isEditMode
              ? updateBookmark.status === "executing"
              : addBookmark.status === "executing"
          }
        >
          {isEditMode ? "Update" : "Create"} Bookmark
        </Button>
      </form>
    </Form>
  );

  if (isEditMode) {
    return renderForm();
  }

  return (
    <div>
      <Tabs defaultValue="fetch">
        <TabsList>
          <TabsTrigger value="fetch">Fetch</TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
        </TabsList>
        <TabsContent value="fetch">
          <div className="relative">
            <Input
              placeholder="URL"
              onChange={({ target }) => {
                if (target.value.length > 0) {
                  debounceFetch(target.value);
                }
              }}
            />
            {loading && (
              <div className="absolute top-2 right-3">
                <Loader2 className="animate-spin size-5" />
              </div>
            )}
          </div>
          <div className="flex flex-row items-start mt-4 space-x-2">
            <Checkbox
              checked={form.watch("isStarred")}
              onCheckedChange={(checked) =>
                form.setValue("isStarred", checked as boolean)
              }
            />
            <div className="space-y-1 leading-none flex flex-col">
              <span className="font-medium">Star</span>
              <span className="text-sm text-muted-foreground">
                Save this bookmark to your starred bookmarks
              </span>
            </div>
          </div>
          <Button
            type="button"
            onClick={form.handleSubmit((data) => addBookmark.execute(data))}
            disabled={loading || addBookmark.status === "executing"}
            className="mt-5"
          >
            Create Bookmark
          </Button>
        </TabsContent>
        <TabsContent value="manual">{renderForm()}</TabsContent>
      </Tabs>
    </div>
  );
}
