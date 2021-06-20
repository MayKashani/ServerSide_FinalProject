using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Data;
using System.Text;
using System.Data.SqlClient;


namespace Assignment1_ServerSide.Models.DAL
{
    public class DataServices
    {
        int current_SeriesID = 0;
        int current_UserID = 0;

        public SqlDataAdapter da;
        public DataTable dt;

        public DataServices()
        {
        }


        //--------------------------------------------------------------------------------------------------
        // This method creates a connection to the database according to the connectionString name in the web.config 
        //--------------------------------------------------------------------------------------------------
        public SqlConnection connect(String conString)
        {

            // read the connection string from the configuration file
            string cStr = WebConfigurationManager.ConnectionStrings[conString].ConnectionString;
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }

        public DataSet GetLikedEpisodes()
        {
            SqlConnection con;
            try
            {
                con = connect("connectionDB");
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            try
            {
                string cStr = "select e.Series_ID,s.Name ,e.ID,e.Episode_Name ,count(distinct f.User_ID) NumOfUsers from Episodes e inner join Favorites f on e.ID = f.Episode_ID inner join Series s on e.Series_ID = s.ID GROUP BY e.Series_ID,s.Name,e.ID, e.Episode_Name";
  
                SqlDataAdapter da = new SqlDataAdapter(cStr, con);
                DataSet ds = new DataSet("AdminDS");
                da.Fill(ds, "LikedEpisodes");
                return ds;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                    con.Close();
            }
        }

        public DataSet GetLikedShows()
		{
            SqlConnection con;
            try
            {
                con = connect("connectionDB");
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
           
            try
            {
                String cStr = "select ID, s.Name, count(distinct f.User_ID) NumOfUsers from Series s inner join Favorites f on s.ID = f.Series_ID GROUP BY ID,s.Name";
                SqlDataAdapter da = new SqlDataAdapter(cStr, con);

                DataSet ds = new DataSet("AdminDS");
                da.Fill(ds,"LikedShows");
                return ds;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                    con.Close();
            }
        }

        public List<User> GetUsers()
		{
            SqlConnection con;
            SqlCommand cmd;
            List<User> users = new List<User>();
            try
            {
                con = connect("connectionDB");
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
           
            try
            {
                String cStr = "SELECT * from UsersTBL";
                cmd = CreateCommand(cStr, con);

                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    int index = 1;
                    User u = new User();
                    u.FirstName = reader.GetString(index++);
                    u.LastName = reader.GetString(index++);
                    u.Mail = reader.GetString(index++);
                    u.Password = reader.GetString(index++);
                    u.PhoneNum = reader.GetString(index++);
                    u.Gender = reader.GetString(index++).ToCharArray()[0];
                    u.BirthYear = reader.GetInt32(index++);
                    u.Style = reader.GetString(index++);
                    u.Address = reader.GetString(index++);
                    users.Add(u);
                }
                return users;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                    con.Close();
            }
        }

        //Series_POST_DB
        public int Insert(Series series)
        {
            SqlConnection con;
            SqlCommand cmd;


            try
            {
                con = connect("ConnectionDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            String cStr = BuildInsertCommand(series);      // helper method to build the insert string


            cmd = CreateCommand(cStr, con);             // create the command

            try
            {
                int numEffected = cmd.ExecuteNonQuery(); // execute the command
                return numEffected;
            }
            catch (SqlException ex)
            {
                // write to log
                if (ex.Number == 2627)
                    return 0;
                throw ex;

            }
            catch (Exception ex)
            {
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }
        // Insert Selected Episode 
        public int Insert(Episode episode, string mail)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("ConnectionDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            current_UserID = GetUserID(mail);
            current_SeriesID = GetSeriesID(episode.SeriesName);
            String cStr = BuildInsertCommand(episode);      // helper method to build the insert string
            cmd = CreateCommand(cStr, con);

            try
            {
                int numEffected = cmd.ExecuteNonQuery(); // execute the command
                return numEffected + InsertToFavorites(episode, mail);
            }

            catch (SqlException ex)
            {
                // write to log
                if (ex.Number == 2627)
                    return InsertToFavorites(episode, mail);
                throw ex;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {

                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }
        public int InsertToFavorites(Episode episode, string mail)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("ConnectionDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("Values ({0},{1},{2})", current_UserID, episode.Id, current_SeriesID);
            String prefix = "INSERT INTO Favorites" + "([User_ID],[Episode_ID],[Series_ID])";
            String cStr = prefix + sb.ToString();
            cmd = CreateCommand(cStr, con);

            try
            {
                int numEffected = cmd.ExecuteNonQuery();
                return numEffected;
            }
            catch (SqlException ex)
            {
                // write to log
                if (ex.Number == 2627)
                    return 0;
                throw ex;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }

        }
        public int GetSeriesID(string name)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("ConnectionDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            try
            {
                //Get SeriesID
                String getID = "SELECT [ID] FROM Series where [Name] = '" + name + "'";
                cmd = CreateCommand(getID, con);  // create the command
                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                while (dataReader.Read())
                {
                    current_SeriesID = (int)dataReader[0];
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
            return current_SeriesID;
        }

        public int GetUserID(string mail)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("ConnectionDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            try
            {
                String getUserID = "SELECT [ID] FROM UsersTBL where [Mail] = '" + mail + "'";
                cmd = CreateCommand(getUserID, con);  // create the command
                SqlDataReader userReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                while (userReader.Read())
                {
                    current_UserID = (int)userReader[0];
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
            return current_UserID;
        }

        //User_POST_DB
        public int Insert(User user)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("ConnectionDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            String cStr = BuildInsertCommand(user);      // helper method to build the insert string
            cmd = CreateCommand(cStr, con);             // create the command

            try
            {
                int numEffected = cmd.ExecuteNonQuery(); // execute the command
                return numEffected;
            }
            catch (SqlException ex)
            {
                // write to log
                if (ex.Number == 2627)
                    return 0;
                throw ex;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        //--------------------------------------------------------------------
        // Build the Insert command String
        //--------------------------------------------------------------------
        private String BuildInsertCommand(Object obj)
        {
            String command;
            String prefix = "";
            StringBuilder sb = new StringBuilder();
            // use a string builder to create the dynamic string
            switch (obj.GetType().Name)
            {
                case "Series":
                    {
                        Series series = (Series)obj;
                        if (series != null)
                        {
                            string seriesName = series.Name.Replace("'", "");
                            string seriesOverview = series.Overview.Replace("'", "");
                            sb.AppendFormat("Values({0}, '{1}', '{2}','{3}','{4}','{5}',{6},'{7}')", series.Id, series.First_Air_Date, seriesName, series.Origin_Country, series.Original_Language, seriesOverview, series.Popularity, series.Poster_Path);
                            prefix = "INSERT INTO Series " + "([ID], [First_Air_Date], [Name], [Origin_Country], [Original_Language], [Overview], [Popularity], [Poster_Path]) ";
                        }
                        break;
                    }
                case "User":
                    {
                        User user = (User)obj;
                        if (user != null)
                        {
                            sb.AppendFormat("Values('{0}', '{1}', '{2}','{3}','{4}','{5}',{6},'{7}','{8}')", user.FirstName, user.LastName, user.Mail, user.Password, user.PhoneNum, user.Gender, user.BirthYear, user.Style, user.Address);
                            prefix = "INSERT INTO UsersTBL " + "([FirstName], [LastName], [Mail], [Pass], [PhoneNum], [Gender], [BirthYear], [Style], [HomeAddress]) ";
                        }
                        break;
                    }
                case "Episode":
                    {
                        Episode episode = (Episode)obj;
                        string episodeName = episode.EpisodeName.Replace("'", "");
                        string episodeOverview = episode.Overview.Replace("'", "");
                        if (episode != null)
                        {
                            sb.AppendFormat("Values({0}, {1}, {2},'{3}','{4}','{5}','{6}')", current_SeriesID, episode.Id, episode.Season, episodeName, episode.ImageURL, episodeOverview, episode.AirDate);
                            prefix = "INSERT INTO Episodes " + "([Series_ID], [ID], [Season_Number], [Episode_Name],[ImageURL], [Overview], [Air_Date]) ";
                        }
                        break;

                    }
            }
            command = prefix + sb.ToString();

            return command;
        }
        //---------------------------------------------------------------------------------
        // Create the SqlCommand
        //---------------------------------------------------------------------------------
        private SqlCommand CreateCommand(String CommandSTR, SqlConnection con)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = CommandSTR;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.Text; // the type of the command, can also be stored procedure

            return cmd;
        }


        public User Get(string mail, string password) 
        {
            SqlConnection con;
            SqlCommand cmd;
            User u = new User();
            try
            {
                con = connect("connectionDB");
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            String cStr = "SELECT * FROM UsersTBL where [Mail]='" + mail + "' and [Pass]='" + password + "'";
            cmd = CreateCommand(cStr, con);

            SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                int index = 1;
                u.FirstName = reader.GetString(index++);
                u.LastName = reader.GetString(index++);
                u.Mail = reader.GetString(index++);
                u.Password = reader.GetString(index++);
                u.PhoneNum = reader.GetString(index++);
                u.Gender = reader.GetString(index++).ToCharArray()[0];
                u.BirthYear = reader.GetInt32(index++);
                u.Style = reader.GetString(index++);
                u.Address = reader.GetString(index++);
            }
            return u;
        }

        public List<Series> Get(string mail)
        {
            SqlConnection con;
            SqlCommand cmd;
            List<Series> sList = new List<Series>();
            try
            {
                con = connect("connectionDB");
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            try
            {
                String cStr = "SELECT distinct Series_ID,S.Name FROM Favorites F inner join Series S on F.Series_ID = S.ID  inner join UsersTBL u on u.ID = F.User_ID where u.Mail='" + mail + "'";
                cmd = CreateCommand(cStr, con);

                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Series s = new Series();
                    s.Id = (int)reader["Series_ID"];
                    s.Name = reader["Name"].ToString();
                    sList.Add(s);
                }
                return sList;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
			finally
			{
                if (con != null)
                    con.Close();
			}
        }

        public List<Episode> Get(int seriesID, string mail)
        {
            SqlConnection con;
            SqlCommand cmd;
            List<Episode> eList = new List<Episode>();
            try
            {
                con = connect("connectionDB");
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            String cStr = "Select E.* FROM Favorites F inner join Episodes E on F.Series_ID=E.Series_ID and F.Episode_ID=E.ID inner join UsersTBL U on U.ID = F.User_ID where U.Mail='" + mail + "' and E.Series_ID = " + seriesID;
            cmd = CreateCommand(cStr, con);

            SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                Episode e = new Episode();
                e.Id = (int)reader["ID"];
                e.Season = (int)reader["Season_Number"];
                e.EpisodeName = reader["Episode_Name"].ToString();
                e.ImageURL = reader["ImageURL"].ToString();
                e.Overview = reader["Overview"].ToString();
                e.AirDate = reader["Air_Date"].ToString();
                eList.Add(e);
            }
            return eList;
        }

        public List<Series> GetRecommendations(string mail)
        {
            SqlConnection con;
            SqlCommand cmd;
            List<Series> sList = new List<Series>();
            try
            {
                con = connect("connectionDB");
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            try
            {
                int userId = GetUserID(mail);
                String cStr = "select distinct s.* from Favorites fav inner join Series s on fav.Series_ID = s.ID where fav.User_ID in (select f2.User_ID from Favorites f1 inner join Favorites f2 on f1.Series_ID = f2.Series_ID  inner join favorites f3 on f2.User_ID = f3.User_ID inner join favorites f4  on f4.User_ID = f1.User_ID where f1.User_ID = "+userId+" and f2.User_ID != "+userId+" group by f1.User_ID, f2.User_ID having ROUND(CAST(count(distinct f2.Series_ID) AS float) / CAST(count(distinct f3.Series_ID) AS float), 2) * ROUND(CAST(count(distinct f1.Series_ID) AS float) / CAST(count(distinct f4.Series_ID) AS float), 2) > 0.5) and fav.Series_ID not in (select distinct favorite.Series_id from Favorites favorite where favorite.User_ID = "+userId+")";
                cmd = CreateCommand(cStr, con);

                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Series s = new Series();
                    s.Id = reader;
                    s.First_Air_Date = reader["First_Air_Date"].ToString();
                    s.Name = reader["Name"].ToString();
                    s.Origin_Country = reader["Origin_Country"].ToString();
                    s.Original_Language = reader["Original_Language"].ToString();
                    s.Overview = reader["Overview"].ToString();
                    s.Popularity = reader["Popularity"]

                    sList.Add(s);
                }
                return sList;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                    con.Close();
            }
        }
    }
}