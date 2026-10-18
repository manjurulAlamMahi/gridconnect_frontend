import { Download } from "lucide-react";
import { SubscriptionControlsCard } from "./SubscriptionControlCard";
import { useGetPaymentHistoryQuery } from "@/redux/endpoints/subscription/subscription.api";
import { useGetTokenPurchaseHistoryQuery } from "@/redux/endpoints/token/token.api";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ITokenPurchase } from "@/types/token";
import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type TokenPaymentRow = {
  id: ITokenPurchase["id"];
  date: ITokenPurchase["purchased_at"];
  packageName: ITokenPurchase["package_name"];
  amount: ITokenPurchase["amount"];
  tokens: ITokenPurchase["tokens_purchased"];
  status: ITokenPurchase["status"];
};

type JsPDFWithAutoTable = InstanceType<typeof jsPDF> & {
  lastAutoTable?: { finalY: number };
};

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
  const [activeTab, setActiveTab] = useState("subscription");
  const {
    data: subData,
    isLoading: subLoading,
    error: subError,
  } = useGetPaymentHistoryQuery();
  const {
    data: tokenData,
    isLoading: tokenLoading,
    error: tokenError,
  } = useGetTokenPurchaseHistoryQuery(undefined, {
    skip: activeTab !== "token",
  });

  const subPayments = React.useMemo(() => {
    if (!subData?.data) return [];

    const invoices = Array.isArray(subData.data)
      ? subData.data
      : [subData.data];

    return invoices.map((invoice) => ({
      id: invoice.invoice_id,
      date: invoice.date,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: invoice.status,
      receiptUrl: invoice.invoice_url,
    }));
  }, [subData]);

  const tokenPayments = React.useMemo((): TokenPaymentRow[] => {
    if (!tokenData?.data?.purchases) return [];

    return tokenData.data.purchases.map((purchase) => ({
      id: purchase.id,
      date: purchase.purchased_at,
      packageName: purchase.package_name,
      amount: purchase.amount,
      tokens: purchase.tokens_purchased,
      status: purchase.status,
    }));
  }, [tokenData]);

  const handleDownloadTokenInvoice = (purchase: TokenPaymentRow) => {
    const doc = new jsPDF();

    // Add company logo or name
    doc.setFontSize(22);
    doc.text("Grid Connect", 105, 20, { align: "center" });

    doc.setFontSize(16);
    doc.text("TOKEN PURCHASE INVOICE", 105, 30, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice Date: ${formatDate(new Date().toISOString())}`, 20, 45);
    doc.text(`Purchase Date: ${formatDate(purchase.date)}`, 20, 50);
    doc.text(`Transaction ID: #TK-${purchase.id}`, 20, 55);

    autoTable(doc, {
      startY: 65,
      head: [["Description", "Tokens", "Status", "Amount"]],
      body: [
        [
          `Token Package: ${purchase.packageName}`,
          purchase.tokens.toString(),
          purchase.status.toUpperCase(),
          `$${purchase.amount}`,
        ],
      ],
      headStyles: { fillColor: [205, 5, 0] },
      theme: "striped",
    });

    const finalY =
      ((doc as JsPDFWithAutoTable).lastAutoTable?.finalY ?? 65) + 10;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Amount: $${purchase.amount}`, 140, finalY + 10);

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Thank you for your purchase!", 105, finalY + 30, {
      align: "center",
    });

    doc.save(`Invoice_Token_${purchase.id}.pdf`);
  };

  return (
    <>
      <div className="w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Card */}
          <div className="rounded-lg border bg-[#1A1A1A] shadow-md overflow-hidden">
            {/* Header */}
            <div className="px-4 py-4 sm:px-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg font-semibold text-slate-100">
                Payment History
              </h3>
              <TabsList className="w-full sm:w-auto bg-black/40 border border-white/10 p-1 h-auto grid grid-cols-2 sm:flex">
                <TabsTrigger
                  value="subscription"
                  className="px-4 py-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
                >
                  Subscription
                </TabsTrigger>
                <TabsTrigger
                  value="token"
                  className="px-4 py-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
                >
                  Token Purchase
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Table area */}
            <div className="p-4 sm:p-6">
              <TabsContent value="subscription" className="mt-0">
                {subLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-4 border-b"
                      >
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-12 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                ) : subError ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No payment history found</p>
                  </div>
                ) : subPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No payment history found</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 md:hidden">
                      {subPayments.map((p) => (
                        <div
                          key={p.id}
                          className="rounded-lg border border-white/10 bg-black/20 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs text-accent/60">Date</p>
                              <p className="text-sm text-slate-200">
                                {formatDate(p.date)}
                              </p>
                            </div>
                            {p.status === "paid" ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#19261E] text-green-300">
                                Paid
                              </span>
                            ) : p.status === "pending" ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-yellow-900/60 text-yellow-300">
                                Pending
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-rose-900/60 text-rose-300">
                                Failed
                              </span>
                            )}
                          </div>

                          <div className="mt-3">
                            <p className="text-xs text-accent/60">Amount</p>
                            <p className="text-sm text-slate-200 font-semibold">
                              {p.currency === "USD"
                                ? "$"
                                : p.currency === "GBP"
                                  ? "£"
                                  : "$"}
                              {p.amount}
                            </p>
                          </div>

                          <a
                            href={p.receiptUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group mt-3 inline-flex items-center gap-2 text-xs font-medium text-primary! hover:text-primary/80 transition-all duration-300 rounded-lg px-2 py-1.5 hover:bg-primary/5 cursor-pointer"
                          >
                            <Download className="text-primary h-4 w-4" />
                            <span>Download Invoice</span>
                          </a>
                        </div>
                      ))}
                    </div>

                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full table-fixed">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left text-sm text-accent/60 pb-4 pr-6 w-[100px]">
                              Date
                            </th>
                            <th className="text-left text-sm text-accent/60 pb-4 pr-6 w-20">
                              Amount
                            </th>
                            <th className="text-left text-sm text-accent/60 pb-4 pr-6 w-20">
                              Status
                            </th>
                            <th className="text-left text-sm text-accent/60 pb-4 w-40">
                              Receipt
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y">
                          {subPayments.map((p) => (
                            <tr
                              key={p.id}
                              className="align-middle border-white/5 border-b last:border-0"
                            >
                              <td className="py-4 text-sm text-slate-200">
                                {formatDate(p.date)}
                              </td>

                              <td className="py-4 text-sm text-slate-200 font-semibold">
                                {p.currency === "USD"
                                  ? "$"
                                  : p.currency === "GBP"
                                    ? "£"
                                    : "$"}
                                {p.amount}
                              </td>

                              <td className="py-4">
                                {/* Status pill */}
                                {p.status === "paid" ? (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#19261E] text-green-300">
                                    Paid
                                  </span>
                                ) : p.status === "pending" ? (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-yellow-900/60 text-yellow-300">
                                    Pending
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-rose-900/60 text-rose-300">
                                    Failed
                                  </span>
                                )}
                              </td>

                              <td className="py-4 ">
                                <a
                                  href={p.receiptUrl || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group inline-flex items-center gap-2 text-xs font-medium text-primary! hover:text-primary/80 transition-all duration-300 rounded-lg px-2 py-1.5 hover:bg-primary/5 cursor-pointer"
                                >
                                  <Download className="text-primary h-4 w-4" />
                                  <span>Download Invoice</span>
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="token" className="mt-0">
                {tokenLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-4 border-b"
                      >
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-12 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                ) : tokenError ? (
                  <div className="text-center py-8">
                    <p className="text-red-400">Failed to load token history</p>
                  </div>
                ) : tokenPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">
                      No token purchase history found
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 md:hidden">
                      {tokenPayments.map((p) => (
                        <div
                          key={p.id}
                          className="rounded-lg border border-white/10 bg-black/20 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs text-accent/60">Date</p>
                              <p className="text-sm text-slate-200">
                                {formatDate(p.date)}
                              </p>
                            </div>
                            {p.status === "succeeded" || p.status === "paid" ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#19261E] text-green-300 ">
                                Paid
                              </span>
                            ) : p.status === "pending" ||
                              p.status === "processing" ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-yellow-900/60 text-yellow-300 uppercase">
                                Pending
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-rose-900/60 text-rose-300 uppercase">
                                Failed
                              </span>
                            )}
                          </div>

                          <div className="mt-3">
                            <p className="text-xs text-accent/60">Package</p>
                            <p className="text-sm text-slate-200 font-medium">
                              {p.packageName} ({p.tokens} tokens)
                            </p>
                          </div>

                          <div className="mt-3">
                            <p className="text-xs text-accent/60">Amount</p>
                            <p className="text-sm text-slate-200 font-semibold">
                              ${p.amount}
                            </p>
                          </div>

                          <button
                            onClick={() => handleDownloadTokenInvoice(p)}
                            className="group mt-3 inline-flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-all duration-300 rounded-lg px-2 py-1.5 hover:bg-primary/5 cursor-pointer"
                          >
                            <Download className="text-primary h-4 w-4" />
                            <span>Download Invoice</span>
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full table-fixed">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left text-sm text-accent/60 pb-4 pr-6 w-[100px]">
                              Date
                            </th>
                            <th className="text-left text-sm text-accent/60 pb-4 pr-6 w-[100px]">
                              Package
                            </th>
                            <th className="text-left text-sm text-accent/60 pb-4 pr-6 w-20">
                              Amount
                            </th>
                            <th className="text-left text-sm text-accent/60 pb-4 w-[100px]">
                              Status
                            </th>
                            <th className="text-left text-sm text-accent/60 pb-4 w-40">
                              Receipt
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y space-y-2">
                          {tokenPayments.map((p) => (
                            <tr
                              key={p.id}
                              className="align-middle border-white/5 border-b last:border-0 border-spacing-y-2"
                            >
                              <td className="py-4 text-sm text-slate-200">
                                {formatDate(p.date)}
                              </td>

                              <td className="py-4 text-sm text-slate-200 font-medium">
                                {p.packageName} ({p.tokens} tokens)
                              </td>

                              <td className="py-4 text-sm text-slate-200 font-semibold">
                                ${p.amount}
                              </td>

                              <td className="py-4">
                                {/* Status pill */}
                                {p.status === "succeeded" ||
                                p.status === "paid" ? (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#19261E] text-green-300 ">
                                    Paid
                                  </span>
                                ) : p.status === "pending" ||
                                  p.status === "processing" ? (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-yellow-900/60 text-yellow-300 uppercase">
                                    Pending
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-rose-900/60 text-rose-300 uppercase">
                                    Failed
                                  </span>
                                )}
                              </td>

                              <td className="py-4 ">
                                <button
                                  onClick={() => handleDownloadTokenInvoice(p)}
                                  className="group inline-flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-all duration-300 rounded-lg px-2 py-1.5 hover:bg-primary/5 cursor-pointer"
                                >
                                  <Download className="text-primary h-4 w-4" />
                                  <span>Download Invoice</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
      <SubscriptionControlsCard />
    </>
  );
}
