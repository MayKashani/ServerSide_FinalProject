using Assignment1_ServerSide.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Assignment1_ServerSide.Controllers
{
    public class MoviesController : ApiController
    {

        // GET api/<controller>/5
        public List<Movie> Get(string mail,string mode)
        {
            Movie m = new Movie();
            return m.Get(mail, mode);
        }

        // POST api/<controller>
        [HttpPost]
        public int Post([FromBody] Movie movie,string mail)
        {
            return movie.Insert(mail);
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