package com.merls.business;

public class Participant {
	private static String participantId = "";
	private static String participantName = "";
	private static boolean isCompletedEN = false;
	private static boolean isCompletedCN = false;
	private static boolean isActive = false;
	
	public Participant(String participantId, String participantName, boolean isCompletedEN, boolean isCompletedCN, boolean isActive) {
		super();
		this.participantId = participantId;
		this.participantName = participantName;
		this.isCompletedEN = isCompletedEN;
		this.isCompletedCN = isCompletedCN;
		this.isActive = isActive;
	}

	public static void setParticipantId(String participantId) {
		Participant.participantId = participantId;
	}

	public static void setParticipantName(String participantName) {
		Participant.participantName = participantName;
	}

	public static void setIsCompletedEN(boolean isCompletedEN) {
		Participant.isCompletedEN = isCompletedEN;
	}

	public static void setIsCompletedCN(boolean isCompletedCN) {
		Participant.isCompletedCN = isCompletedCN;
	}

	public static void setIsActive(boolean isActive) {
		Participant.isActive = isActive;
	}

	public static String getParticipantId() {
		return participantId;
	}

	public static String getParticipantName() {
		return participantName;
	}

	public static boolean isIsCompletedEN() {
		return isCompletedEN;
	}

	public static boolean isIsCompletedCN() {
		return isCompletedCN;
	}

	public static boolean isIsActive() {
		return isActive;
	}
}