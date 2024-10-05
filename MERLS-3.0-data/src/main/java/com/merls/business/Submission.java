package com.merls.business;

import java.util.HashMap;
import java.util.Map;

public class Submission {
	
	//public int submissionId;
	//public String[] userAns;
	public String participantId;
	public HashMap<Integer, Integer> userAns;
	public boolean isEN;

	public Submission() {
	}
	
	public Submission(String participantId, HashMap<Integer, Integer> userAns, boolean isEN) {
		super();
		this.participantId = participantId;
		this.userAns = userAns;
		this.isEN = isEN;
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
}