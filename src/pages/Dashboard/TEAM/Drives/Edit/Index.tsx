import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { UsersRound } from "lucide-react";
import EditDriveHeader from "../_components/EditDriveHeader";
import CreateDriveForm from "../_components/CreateDriveForm";
import RacingInformationSection from "../_components/RacingInformationSection";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  useGetTeamOpportunityQuery,
  useUpdateTeamOpportunityMutation,
} from "@/redux/endpoints/team/drives.api";
import { toast } from "sonner";
import LogoIcon from "@/assets/Icons/Logo.svg";
import { cn } from "@/lib/utils";
import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";

type OpportunityStatus = "active" | "inactive";

interface EditDriveFormValues {
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

export default function EditDrive() {
  const { id } = useParams();

  useSEO({
    title: "Edit Drive Opportunity",
    description: "Update your drive opportunity.",
  });
  
  const navigate = useNavigate();
  const { data: opportunityData, isLoading: isFetching } =
    useGetTeamOpportunityQuery(id as string, {
      skip: !id,
      refetchOnMountOrArgChange: true,
    });
  const [updateTeamOpportunity, { isLoading: isUpdating }] =
    useUpdateTeamOpportunityMutation();

  const methods = useForm<EditDriveFormValues>({
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

  useEffect(() => {
    if (opportunityData?.data) {
      const data = opportunityData.data;
      methods.reset({
        title: data.title || "",
        license_type_id: data.license_type_id?.toString() || "",
        currency: data.currency || "$",
        min_budget: data.min_budget || "",
        max_budget: data.max_budget || "",
        description: data.description || "",
        team_support: data.team_support || "",
        experience: data.experience || "",
        location: data.location || "",
        deadline: data.deadline ? data.deadline.split(" ")[0] : "",
        available_seat: data.available_seat || "",
        contract_duration: data.contract_duration || "",
        discipline_id: data.disciplines?.map((d: { id: number }) => d.id) || [],
        status: (data.status as OpportunityStatus) || "inactive",
      });
    }
  }, [opportunityData, methods]);

  const onSubmit = async (data: EditDriveFormValues) => {
    if (!id) return;
    try {
      const formData = new FormData();

      (Object.keys(data) as Array<keyof EditDriveFormValues>).forEach((key) => {
        if (key === "discipline_id") {
          data[key].forEach((disciplineId) => {
            formData.append("discipline_id[]", disciplineId.toString());
          });
        } else {
          formData.append(key, String(data[key]));
        }
      });

      await updateTeamOpportunity({ id, data: formData }).unwrap();
      toast.success("Opportunity updated successfully");
      navigate("/team/dashboard/drives");
    } catch (error: unknown) {
      const apiError = error as ErrorWithMessage;
      toast.error(apiError.data?.message || "Failed to update opportunity");
    }
  };

  const currentStatus = methods.watch("status");

  const toggleStatus = () => {
    methods.setValue("status", currentStatus === "inactive" ? "active" : "inactive", {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div
          className={cn(
            "flex flex-col items-center transition-transform duration-700",
            isFetching ? "scale-110" : "scale-100"
          )}
        >
          <img
            src={LogoIcon}
            alt="GridConnect Logo"
            className="w-24 h-24 md:w-32 md:h-32 mb-4 animate-pulse"
          />
          {/* <div className="flex flex-col items-center font-bold text-3xl md:text-4xl text-accent leading-tight">
          <span className="tracking-wide">Grid</span>
          <span className="-mt-2">Connect</span>
        </div> */}
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <section className="space-y-6 text-white">
        <EditDriveHeader
          onSave={methods.handleSubmit(onSubmit)}
          isLoading={isUpdating}
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
                  Edit the essential information about this drive opportunity.
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
