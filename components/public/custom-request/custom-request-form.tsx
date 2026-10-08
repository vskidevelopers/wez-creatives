"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { submitCustomRequestAction } from "@/lib/actions/custom-requests";
import { uploadCustomRequestArtworkAction } from "@/lib/actions/custom-request-artwork";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { X, Upload, FileText } from "lucide-react";

type ArtworkFile = {
  id: string;
  secureUrl: string;
  originalFilename: string;
};

export function CustomRequestForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [artworkFiles, setArtworkFiles] = useState<ArtworkFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    requestType: "",
    projectDescription: "",
    quantity: "",
    preferredDeadline: "",
    additionalNotes: "",
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setUploading(true);
    setError("");

    try {
      for (const file of files) {
        const result = await uploadCustomRequestArtworkAction(file);
        setArtworkFiles((prev) => [...prev, { ...result, originalFilename: result.originalFilename ?? file.name }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const removeArtwork = (id: string) => {
    setArtworkFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = await submitCustomRequestAction({
        ...formData,
        quantity: formData.quantity ? parseInt(formData.quantity) : null,
        artworkIds: artworkFiles.map((f) => f.id),
      });

      if (result.success) {
        router.push(`/custom-request-confirmation/${result.reference}`);
      } else {
        setError(result.error || "Failed to submit request");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Your Information</h2>

          <div>
            <label className="text-sm font-medium">Full Name *</label>
            <Input
              required
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone Number *</label>
            <Input
              required
              type="tel"
              placeholder="+254..."
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email Address *</label>
            <Input
              required
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Project Details</h2>

          <div>
            <label className="text-sm font-medium">Request Type *</label>
            <select
              required
              value={formData.requestType}
              onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="">Select a service type</option>
              <option value="branding">Branding</option>
              <option value="printing">Printing</option>
              <option value="graphic-design">Graphic Design</option>
              <option value="branded-merchandise">Branded Merchandise</option>
              <option value="apparel-branding">Apparel Branding</option>
              <option value="event-promotional">Event / Promotional Materials</option>
              <option value="custom-bulk">Custom / Bulk Production</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Project Description *</label>
            <textarea
              required
              value={formData.projectDescription}
              onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
              className="w-full p-2 border rounded-md bg-background min-h-[150px]"
              placeholder="Describe what you need produced, intended use, preferred design/style, specifications, etc."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Approximate Quantity</label>
              <Input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="e.g., 100"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Preferred Deadline</label>
              <Input
                type="date"
                value={formData.preferredDeadline}
                onChange={(e) => setFormData({ ...formData, preferredDeadline: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Additional Notes</label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              className="w-full p-2 border rounded-md bg-background min-h-[80px]"
              placeholder="Any other information you'd like us to know"
            />
          </div>
        </CardContent>
      </Card>

      {/* Artwork Upload */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Artwork / Files (Optional)</h2>
          <p className="text-sm text-muted-foreground">
            Upload logos, designs, or reference files. Accepted formats: JPG, PNG, SVG, PDF (max 10MB each)
          </p>

          <div className="space-y-3">
            {artworkFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">{file.originalFilename}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeArtwork(file.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="flex items-center justify-center w-full p-6 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {uploading ? "Uploading..." : "Click to upload files"}
                </span>
              </div>
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.svg,.pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Request"}
      </Button>
    </form>
  );
}