import { ParticipantInput } from '../types/participant'

export class RegistrationService {
  static async createParticipant(data: ParticipantInput) {
    // Validation, duplicate check, Firestore write
  }

  static async updatePayment(participantId: string, amount: number) {
    // State transition validation, audit trail
  }

  static async assignRoom(participantId: string, roomId: string) {
    // Transaction-based assignment
  }
}
