import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { UsersRound } from "lucide-react";
import CreateDriveHeader from "../_components/CreateDriveHeader";
import CreateDriveForm from "../_components/CreateDriveForm";
import RacingInformationSection from "../_components/RacingInformationSection";
import { useForm, FormProvider, type FieldErrors } from "react-hook-form";
import { useStoreTeamOpportunityMutation } from "@/redux/endpoints/team/team.api";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";

type OpportunityStatus = "active" | "inactive";

interface CreateDriveFormValues {
  title: string;
  license_type_id: string;
  currency: string;
  min_budget: string;
  max_budget: string;
  description: string;
  team_support: string;
  experience: string;
  location: string;
  deadline: string;
  available_seat: string;
  contract_duration: string;
  discipline_id: number[];
  status: OpportunityStatus;
}

interface ErrorWithMessage {
  data?: {
    message?: string;
  };
}

export default function CreateDrive() {
  useSEO({
    title: "Create New Drive Opportunity",
    description: "Post a new drive opportunity for drivers.",
  });

  const methods = useForm<CreateDriveFormValues>({
    defaultValues: {
      title: "",
      license_type_id: "",
      currency: "$",
      min_budget: "",
      max_budget: "",
      description: "",
      team_support: "",
      experience: "",
      location: "",
      deadline: "",
      available_seat: "",
      contract_duration: "",
      discipline_id: [],
      status: "inactive",
    },
  });

  const [storeTeamOpportunity, { isLoading }] =
    useStoreTeamOpportunityMutation();
  const navigate = useNavigate();

  const handleCreateOpportunity = async (data: CreateDriveFormValues) => {
    try {
      const formData = new FormData();
      (Object.keys(data) as Array<keyof CreateDriveFormValues>).forEach((key) => {
        if (key === "discipline_id") {
          data[key].forEach((id) => {
            formData.append("discipline_id[]", id.toString());
          });
        } else {
          formData.append(key, String(data[key]));
        }
      });

      const response = await storeTeamOpportunity(formData).unwrap();
      if (response.status === "success") {
        toast.success(response.message || "Opportunity created successfully");
        navigate("/team/dashboard/drives");
      }
    } catch (error: unknown) {
      const apiError = error as ErrorWithMessage;
      toast.error(apiError?.data?.message || "Failed to create opportunity");
    }
  };

  const onInvalid = (errors: FieldErrors<CreateDriveFormValues>) => {
    console.error("Validation Errors:", errors);
    toast.error("Please fill in all required fields correctly.");
  };

  const currentStatus = methods.watch("status");

  const toggleStatus = () => {
    methods.setValue("status", currentStatus === "inactive" ? "active" : "inactive", {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <FormProvider {...methods}>
      <section className="space-y-6 text-white">
        <CreateDriveHeader
          onPublish={methods.handleSubmit(handleCreateOpportunity, onInvalid)}
          isLoading={isLoading}
        />

        <Card className="rounded-3xl border border-white/5 bg-[#1A1A1A] text-white">
          <CardHeader className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/5">
                <UsersRound className="h-5 w-5 text-primary" />
              </span>
              <div>
                <h3 className="text-lg font-semibold">Opportunity Details</h3>
                <p className="text-sm text-white/60">
                  Provide the essential information about this drive opportunity.
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={toggleStatus}
              variant={currentStatus === "active" ? "default" : "secondary"}
              className="min-w-[132px]"
            >
              {currentStatus === "active" ? "Status: Active" : "Status: Inactive"}
            </Button>
          </CardHeader>

          <CardContent className="pt-6">
            <CreateDriveForm />
          </CardContent>
        </Card>
        <RacingInformationSection />
      </section>
    </FormProvider>
  );
}
