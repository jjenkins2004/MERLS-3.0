package com.merls.business;

import java.util.HashMap;

public class Submission {
	
	//public int submissionId;
	//public String[] userAns;
	public String participantId;
	public HashMap<Integer, Integer> userAns;
	public HashMap<Integer, String> audioSubmissionList;
	public HashMap<Integer, HashMap<Integer, String>> storySubmissionList;
	public HashMap<Integer, HashMap<Integer, String>> retellSubmissionList;

	public boolean isEN;
	public boolean isAudioTest;
	public String submissionType;

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

	public String getSubmissionType() {
		return submissionType;
	}
	public void setSubmissionType(String submissionType) {
		this.submissionType = submissionType;
	}

	public HashMap<Integer, HashMap<Integer, String>> getRetellSubmissionList() {
		return retellSubmissionList;
	}
	public void setRetellSubmissionList(HashMap<Integer, HashMap<Integer, String>> retellSubmissionList) {
		this.retellSubmissionList = retellSubmissionList;
	}

	public HashMap<Integer, HashMap<Integer, String>> getStorySubmissionList() {
		return storySubmissionList;
	}
	public void setStorySubmissionList(HashMap<Integer, HashMap<Integer, String>> storySubmissionList) {
		this.storySubmissionList = storySubmissionList;
	}
}