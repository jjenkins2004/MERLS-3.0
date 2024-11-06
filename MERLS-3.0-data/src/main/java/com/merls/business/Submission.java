package com.merls.business;

import java.util.HashMap;

public class Submission {
	
	//public int submissionId;
	//public String[] userAns;
	public String participantId;
	public HashMap<Integer, Integer> userAns;
	public HashMap<Integer, String> audioSubmissionList;
	public boolean isEN;
	public boolean isAudioTest;

	public Submission() {
	}
	
	public Submission(String participantId, HashMap<Integer, Integer> userAns,
					  boolean isEN, boolean isAudioTest, HashMap<Integer, String> audioSubmissionList) {
		super();
		this.participantId = participantId;
		this.userAns = userAns;
		this.isEN = isEN;
		this.isAudioTest = isAudioTest;
		this.audioSubmissionList = audioSubmissionList;
	}
	public String getParticipantId() {
		return participantId;
	}

	public void setParticipantId(String participantId) {
		this.participantId = participantId;
	}
	
	public HashMap<Integer, Integer> getUserAns() {
		return userAns;
	}
	
	public void setUserAns(HashMap<Integer, Integer> userAns) {
		this.userAns = userAns;
	}
	
	public boolean isEN() {
		return isEN;
	}
	
	public void setEN(boolean isEN) {
		this.isEN = isEN;
	}

	public boolean isAudioTest() { return isAudioTest; }
	public void setAudioTest(boolean isAudioTest) { this.isAudioTest = isAudioTest; }

	public HashMap<Integer, String> getAudioSubmissionList() {
		return audioSubmissionList;
	}

	public void setAudioSubmissionList(HashMap<Integer, String> audioSubmissionList) {
		this.audioSubmissionList = audioSubmissionList;
	}
}