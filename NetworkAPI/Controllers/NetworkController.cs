using Microsoft.AspNetCore.Mvc;
using NetworkAPI.Facades;
using System.Net;
using AI.Models;

namespace NetworkAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NetworkController : ControllerBase
    {
        [HttpPost]
        [Route("InitializeNetwork")]
        public ActionResult<Guid> InitializeNetwork(NetworkParameters parameters)
        {
            var networkID = NetworkFacade.AddNetwork(parameters);

            Response.StatusCode = StatusCodes.Status201Created;
            return networkID;
        }

        [HttpPost]
        [Route("TrainNetwork")]
        public ActionResult<string> TrainNetwork(Guid networkID)
        {
            NetworkFacade.TrainNetwork(networkID);

            Response.StatusCode = StatusCodes.Status202Accepted;
            return "Network training started";
        }

        [HttpPost]
        [Route("EvaluateNetwork")]
        public ActionResult EvaluateNetwork(Guid networkID)
        {
            NetworkFacade.EvaluateNetwork(networkID);

            return Ok();
        }

        [HttpGet]
        [Route("NetworkCurrentStatus")]
        public ActionResult NetworkCurrentStatus([FromQuery] Guid networkID)
        {
            var status = NetworkFacade.NetworkCurrentStatus(networkID);

            return Ok(status);
        }

        [HttpDelete]
        [Route("RemoveNetwork")]
        public ActionResult RemoveNetwork(Guid networkID)
        {
            NetworkFacade.RemoveNetwork(networkID);

            return Ok("Network removed");
        }
    }
}