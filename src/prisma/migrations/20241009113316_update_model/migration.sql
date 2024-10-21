/*
  Warnings:

  - You are about to drop the column `sendSMSTo` on the `sent_voice_call` table. All the data in the column will be lost.
  - You are about to drop the column `smsType` on the `voice_call_setting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sent_voice_call` DROP COLUMN `sendSMSTo`,
    ADD COLUMN `sendVoiceCallTo` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `voice_call_setting` DROP COLUMN `smsType`,
    ADD COLUMN `voiceCallType` VARCHAR(191) NULL;
