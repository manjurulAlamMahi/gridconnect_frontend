import { Download } from "lucide-react";
import { SubscriptionControlsCard } from "./SubscriptionControlCard";
import { useGetPaymentHistoryQuery } from "@/redux/endpoints/subscription/subscription.api";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

/* Helper to format the date like "10 Nov 2025" */
function formatDate(isoDate: string) {
  try {
    const d = new Date(isoDate);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return isoDate;
  }
}

/* Main component */
export default function PaymentHistory() {
  const { data, isLoading, error } = useGetPaymentHistoryQuery();

  const payments = React.useMemo(() => {
    if (!data?.data) return [];

    const invoices = Array.isArray(data.data) ? data.data : [data.data];

    return invoices.map((invoice) => ({
      id: invoice.invoice_id,
      date: invoice.date,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: invoice.status,
      receiptUrl: invoice.invoice_url,
    }));
  }, [data]);

  return (
    <>
      <div className="w-full">
        {/* Card */}
        <div className="rounded-lg border bg-[#1A1A1A] shadow-md overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-slate-100">
              Payment History
            </h3>
          </div>

          {/* Table area */}
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-yellow-500">No payment history found!</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No payment history found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left text-sm text-accent/60 pb-4 pr-6">
                        Date
                      </th>
                      <th className="text-left text-sm text-accent/60 pb-4 pr-6">
                        Amount
                      </th>
                      <th className="text-left text-sm text-accent/60 pb-4 pr-6">
                        Status
                      </th>
                      <th className="text-left text-sm text-accent/60 pb-4">
                        Receipt
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {payments.map((p) => (
                      <tr key={p.id} className="align-middle">
                        <td className="py-4 text-sm text-slate-200">
                          {formatDate(p.date)}
                        </td>

                        <td className="py-4 text-sm text-slate-200 font-semibold">
                          {p.currency === "USD" ? "$" : p.currency === "GBP" ? "£" : ""}
                          {p.amount}
                        </td>

                        <td className="py-4">
                          {/* Status pill */}
                          {p.status === "paid" ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#19261E] text-green-300">
                              Paid
                            </span>
                          ) : p.status === "pending" ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-900/60 text-yellow-300">
                              Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-900/60 text-rose-300">
                              Failed
                            </span>
                          )}
                        </td>

                        <td className="py-4 ">
                          <a
                            href={p.receiptUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 rounded-lg px-3 py-2 hover:bg-primary/5"
                          >
                            <Download className="text-primary h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />
                            <span className="text-primary transition-all duration-300 group-hover:font-semibold">Download Invoice</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* bottom divider line */}
                <div className="mt-4 border-t" />
              </div>
            )}
          </div>
        </div>
      </div>
      <SubscriptionControlsCard />
    </>
  );
}
