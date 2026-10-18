import { useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Paperclip, Send, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BackLink from "../Join/_components/BackLink";
import ContactInfo from "./_components/ContactInfo";
import { toast } from "sonner";
import { useSubmitContactFormMutation } from "@/redux/endpoints/home/home.api";
import { useSEO } from "@/hooks/use-seo";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  attachment: z.instanceof(File).optional(),
});

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export default function ContactUs() {
  useSEO({
    title: "Contact Us",
    description:
      "Get in touch with GridConnect. We are here to help you with any questions or support.",
    canonical: "https://www.gridconnect.app/contact",
    ogType: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact GridConnect",
      description: "Get in touch with GridConnect for support and inquiries.",
      url: "https://www.gridconnect.app/contact",
      mainEntity: {
        "@type": "Organization",
        name: "GridConnect",
        url: "https://www.gridconnect.app/",
      },
    },
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitContactForm, { isLoading }] = useSubmitContactFormMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
      attachment: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("name", values.fullName);
      formData.append("email", values.email);
      formData.append("subject", values.subject);
      formData.append("message", values.message);

      if (values.attachment) {
        formData.append("attachment", values.attachment);
      }

      await submitContactForm(formData).unwrap();

      toast.success("Message sent successfully!");
      form.reset();
      setSelectedFile(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 md:p-12 font-sans overflow-hidden">
      <BackLink
        label="Back"
        className="mb-6 inline-block fixed top-15 left-20 z-20"
      />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-center mb-12"
      >
        Get in <span className="text-red-600">Touch</span>
      </motion.h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Contact Form */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-[#1a1a1a] p-8 rounded-xl border border-white/5 shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-6 text-xl font-semibold">
            <div className="p-2 bg-white/5 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            Contact <span className="text-primary">Form</span>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                            className="bg-black border-none h-12 focus-visible:ring-1 focus-visible:ring-red-600/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email address"
                            {...field}
                            className="bg-black border-none h-12 focus-visible:ring-1 focus-visible:ring-red-600/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-400">Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Write a subject"
                          {...field}
                          className="bg-black border-none h-12 focus-visible:ring-1 focus-visible:ring-red-600/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-400">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write message here..."
                          className="bg-black border-none min-h-[150px] focus-visible:ring-1 focus-visible:ring-red-600/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm text-gray-400">
                  Attachments (Optional)
                </label>
                <div className="flex items-center justify-center w-full bg-black rounded-md h-12 border-none cursor-pointer hover:bg-white/5 transition-colors mt-1.5">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-400 w-full h-full justify-center">
                    <Paperclip className="w-4 h-4" />
                    <span>
                      {selectedFile ? selectedFile.name : "Choose file"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          form.setValue("attachment", file);
                        }
                      }}
                    />
                  </label>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-b from-primary to-primary/60 h-12 text-lg font-bold transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 active:scale-95"
                >
                  <Send className="mr-2 w-5 h-5" />
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </motion.div>
            </form>
          </Form>
        </motion.div>

        {/* Right Column: Info & Socials */}
        <ContactInfo />
      </div>
    </div>
  );
}
