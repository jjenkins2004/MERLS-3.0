package com.merls.data;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.merls.business.*;

public class ParticipantDB {
	// private final static String url = "jdbc:postgresql://merlsdb.cpuk24q4an9x.us-east-2.rds.amazonaws.com:5432/postgres";
	// private final static String username = "merls_admin";
	// private final static String pass = "merlsadmin";
	private final static String driver = "org.postgresql.Driver";
	private final static String url = System.getenv("DB_URL"); // DB URL from environment variable
	private final static String username = System.getenv("DB_USER"); // DB username from environment variable
	private final static String password = System.getenv("DB_PASSWORD"); // DB password from environment variable

	//check if participant valid
	public static boolean participantIfValid (Participant participant) throws SQLException, ClassNotFoundException {
		Class.forName(driver);
		Connection connection = DriverManager.getConnection(url, username, password);
		PreparedStatement ps = null;
		ResultSet rs = null;
		boolean is_valid = false;
		
		String participantId = participant.getParticipantId();

		try {	
			String query = "SELECT EXISTS(SELECT 1 FROM public.participants WHERE participant_id = '"
					+ participantId + "')";
		
				ps = connection.prepareStatement(query);
				rs = ps.executeQuery();
				
				if(rs.next()) {
					is_valid = rs.getBoolean("exists");
				}
				System.out.println("test result=" + is_valid);
			return is_valid;
		}finally {
			ps.close();
			connection.close();
		}
	}

	// Update is_completed_cn for a participant
	public static void updateCompleted(String participantId, String type, String lang) throws SQLException, ClassNotFoundException {
		Class.forName(driver);
		Connection connection = DriverManager.getConnection(url, username, password);
		PreparedStatement ps = null;

		try {
			String updateQuery;
			if (type.equals("story")) {
				if (lang.equals("cn")) {
					updateQuery = "UPDATE public.participants SET completed_story_cn = TRUE WHERE participant_id = ?";
				}
				else {
					updateQuery = "UPDATE public.participants SET completed_story_en = TRUE WHERE participant_id = ?";
				}
			}
			else if (type.equals("repetition")) {
				if (lang.equals("cn")) {
					updateQuery = "UPDATE public.participants SET completed_repetition_cn = TRUE WHERE participant_id = ?";
				}
				else {
					updateQuery = "UPDATE public.participants SET completed_repetition_en = TRUE WHERE participant_id = ?";
				}
			}
			else {
				if (lang.equals("cn")) {
					updateQuery = "UPDATE public.participants SET completed_matching_cn = TRUE WHERE participant_id = ?";
				}
				else {
					updateQuery = "UPDATE public.participants SET completed_matching_en = TRUE WHERE participant_id = ?";
				}
			}
			ps = connection.prepareStatement(updateQuery);
			ps.setString(1, participantId);
			ps.executeUpdate();
		} finally {
			if (ps != null) {
				ps.close();
			}
			connection.close();
		}
	}
}