using Assignment1_ServerSide.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Assignment1_ServerSide.Controllers
{
    public class EpisodesController : ApiController
    {
        [HttpGet]
        public List<Episode> get(int seriesID,string mail)
        {
            Episode e = new Episode();
            List<Episode> eList = e.Get(seriesID,mail);
            return eList;

        }
        
        [HttpGet]
        public DataSet GetLikedEpisodes()
		{

            Episode e = new Episode();
            return e.GetLikedEpisodes();
        }


        // POST api/<controller>
        public int Post([FromBody] Episode e,string mail)
        {
            e.Insert(mail);
            return 1;
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}