import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  type BookmarkEntry,
  BookmarkEntrySchema,
} from "@/lib/validators/add-bookmark";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAction } from "next-safe-action/hooks";
import { addBookmarkAction } from "../_actions/add-bookmark";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  onCompleted: () => void;
}

export default function BookmarkForm(props: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const { sectionId } = useParams();

  const { execute, status, result } = useAction(addBookmarkAction);

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

  const form = useForm<BookmarkEntry>({
    resolver: zodResolver(BookmarkEntrySchema),
    defaultValues: {
      folderId: Array.isArray(sectionId) ? sectionId[0] : sectionId || "",
    },
  });

  const handleSubmit = (data: BookmarkEntry) => {
    execute(data);
  };

  useEffect(() => {
    if (status === "hasSucceeded") {
      toast.success("Bookmark added successfully");
      props.onCompleted();
    }
    if (status === "hasErrored") {
      toast.error("Failed to add bookmark", {
        description: result.serverError || "Something went wrong!",
      });
    }
  }, [status, result]);

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
              checked={form.getValues("isStarred")}
              onCheckedChange={(value) =>
                form.setValue("isStarred", value as boolean)
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
            onClick={() => execute(form.getValues())}
            disabled={loading}
            className="mt-5"
          >
            Create Bookmark
          </Button>
        </TabsContent>
        <TabsContent value="manual">
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
                disabled={status === "executing"}
              >
                Create Bookmark
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
