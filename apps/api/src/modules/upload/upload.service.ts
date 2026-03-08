import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  OnModuleInit,
  Logger,
} from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UploadService implements OnModuleInit {
  private supabase: SupabaseClient;
  private bucket: string;
  private readonly logger = new Logger(UploadService.name);

  constructor(private config: ConfigService) {
    const supabaseUrl = this.config.get<string>("SUPABASE_URL");
    const supabaseKey = this.config.get<string>("SUPABASE_SERVICE_ROLE_KEY");
    this.bucket = this.config.get<string>("SUPABASE_BUCKET") || "uploads";

    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn("Supabase credentials missing. File uploads will fail.");
    }

    this.supabase = createClient(supabaseUrl || "", supabaseKey || "", {
      auth: {
        persistSession: false,
      },
    });
  }

  async onModuleInit() {
    if (!this.supabase) return;

    try {
      const { data, error } = await this.supabase.storage.getBucket(
        this.bucket,
      );
      if (error && error.message.includes("not found")) {
        this.logger.log(`Bucket '${this.bucket}' not found. Creating...`);
        const { error: createError } = await this.supabase.storage.createBucket(
          this.bucket,
          {
            public: true,
          },
        );
        if (createError) {
          this.logger.error(
            `Failed to create bucket '${this.bucket}': ${createError.message}`,
          );
        } else {
          this.logger.log(`Bucket '${this.bucket}' created successfully.`);
        }
      } else if (error) {
        // Some other error
        this.logger.warn(
          `Error checking bucket '${this.bucket}': ${error.message}`,
        );
      }
    } catch (err) {
      // Ignore initialization errors to prevent app crash, but log them
      this.logger.warn(`Failed to initialize Supabase bucket: ${err}`);
    }
  }

  async uploadFile(
    fileBuffer: Buffer,
    filename: string,
    mimetype: string,
  ): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .upload(filename, fileBuffer, {
        contentType: mimetype,
        upsert: true,
      });

    if (error) {
      this.logger.error("Supabase upload error:", error);
      throw new InternalServerErrorException(`Upload failed: ${error.message}`);
    }

    const { data: publicUrlData } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(filename);

    return publicUrlData.publicUrl;
  }
}
