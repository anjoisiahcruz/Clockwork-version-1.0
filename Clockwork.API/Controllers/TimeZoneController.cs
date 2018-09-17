using System;
using Microsoft.AspNetCore.Mvc;
using Clockwork.API.Models;
using System.Linq;

namespace Clockwork.API.Controllers
{
    [Route("api/[controller]")]
    public class TimeZoneController : Controller
    {
        [HttpPost]
        public IActionResult Post(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return Json(new { errorMessage = "Select a Time Zone" });
            }

            var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(id);

            if(timeZoneInfo == null)
            {
                return Json(new { errorMessage = "No TimeZone Found" });
            }

            var utcNow = DateTime.UtcNow;
            var timeZoneTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, timeZoneInfo);
            var ip = this.HttpContext.Connection.RemoteIpAddress.ToString();

            var returnVal = new CurrentTimeQuery
            {
                UTCTime = utcNow,
                ClientIp = ip,
                Time = timeZoneTime
            };

            using (var db = new ClockworkContext())
            {
                db.CurrentTimeQueries.Add(returnVal);
                var count = db.SaveChanges();
            }

            return Ok(returnVal);
        }

        [HttpGet]
        public IActionResult Get()
        {
            var tzCollection = TimeZoneInfo.GetSystemTimeZones().Select(tz => new { tz.Id, tz.DisplayName }).ToList();
            return Ok(tzCollection);
        }
    }
}
