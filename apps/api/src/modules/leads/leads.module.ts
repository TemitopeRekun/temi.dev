import { Module } from "@nestjs/common";
import { LeadsController } from "./leads.controller";
import { LeadsService } from "./leads.service";
import { EmailModule } from "../email/email.module";
import { LeadsAdminController } from "./leads-admin.controller";

@Module({
  imports: [EmailModule],
  controllers: [LeadsController, LeadsAdminController],
  providers: [LeadsService],
})
export class LeadsModule {}
