import { Injectable, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UploadService {
  private supabase: SupabaseClient;
  private bucket: string;

  constructor(private config: ConfigService) {
    const supabaseUrl = this.config.get<string>("SUPABASE_URL");
    const supabaseKey = this.config.get<string>("SUPABASE_SERVICE_ROLE_KEY");
    this.bucket = this.config.get<string>("SUPABASE_BUCKET") || "uploads";

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase credentials missing. File uploads will fail.");
    }

    this.supabase = createClient(supabaseUrl || "", supabaseKey || "", {
      auth: {
        persistSession: false,
      },
    });
  }

  async uploadFile(
    fileBuffer: Buffer,
    filename: string,
    mimetype: string
  ): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .upload(filename, fileBuffer, {
        contentType: mimetype,
        upsert: true,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new InternalServerErrorException(`Upload failed: ${error.message}`);
    }

    const { data: publicUrlData } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(filename);

    return publicUrlData.publicUrl;
  }
}
