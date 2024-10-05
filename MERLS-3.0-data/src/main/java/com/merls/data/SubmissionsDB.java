package com.merls.data;

import java.sql.*;
import java.util.HashMap;
import java.util.Map;

import com.merls.business.*;

public class SubmissionsDB {
	// private final static String url = "jdbc:postgresql://merlsdb.cpuk24q4an9x.us-east-2.rds.amazonaws.com:5432/postgres";
	// private final static String username = "merls_admin";
	// private final static String password = "merlsadmin";
	private final static String url = System.getenv("DB_URL"); // DB URL from environment variable
	private final static String username = System.getenv("DB_USER"); // DB username from environment variable
	private final static String password = System.getenv("DB_PASSWORD"); // DB password from environment variable

	//save submission to database
	public static int postSubmissionsToDB (Submission event) throws SQLException, ClassNotFoundException {
		Connection connection = DriverManager.getConnection(url, username, password);
		PreparedStatement ps = null;
		
		String participantId = event.getParticipantId();
		HashMap<Integer, Integer> userAns = event.getUserAns();
		boolean isEN = event.isEN;
		
		try {	
			String query = "INSERT INTO PUBLIC.SUBMISSIONS(participant_id, question_id, answer, is_correct, is_EN)"
					+ "VALUES(?, ?, ?, ?, ?)";
			
			// iterate to save user's answer to each question into table submission
			for(Map.Entry<Integer, Integer> e : userAns.entrySet()) {
				int userAnswer = e.getValue();
				int questionId = e.getKey();
				
				// check if user's answer correct or not
				boolean is_correct = isCorrect(questionId, userAnswer, isEN, connection);
				
				ps = connection.prepareStatement(query);
				System.out.println("Post data to DB");
				ps.setString(1, participantId);
				ps.setInt(2, questionId);
				ps.setInt(3, userAnswer);
				//for local test only
				//ps.setBoolean(4, true);
				ps.setBoolean(4, is_correct);
				ps.setBoolean(5, isEN);
				ps.executeUpdate();
			}
			return 1;
		}finally {
			ps.close();
			connection.close();
		}
	}
	
	// TO TEST and UPDATE table names once Questions tables are updated
	// method to check if participant's answer is correct
	public static boolean isCorrect(int questionId, int userAnswer, boolean isEN, Connection conn) {
		PreparedStatement ps = null;
		ResultSet rs = null;
		int correctAnswer = 0;
		
		String tableName = isEN ? "english_questions" : "chinese_questions";
		String query = "SELECT answer FROM " + tableName + " WHERE question_id = '" + questionId + "'";
		
		// retrieve correct answer from DB
		try {
			// ps = conn.prepareStatement(query);
			System.out.println(query);
			Statement stmt = conn.createStatement();
			rs = stmt.executeQuery(query);
			if(rs.next()) {
				correctAnswer = rs.getInt("answer");
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return correctAnswer == userAnswer;
	}
}