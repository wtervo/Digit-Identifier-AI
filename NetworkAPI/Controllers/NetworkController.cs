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
        [Route("Initialize")]
        public ActionResult<Guid> Initialize(NetworkParameters parameters)
        {
            var networkID = NetworkFacade.AddNetwork(parameters);

            Response.StatusCode = StatusCodes.Status201Created;
            return networkID;
        }

        [HttpPost]
        [Route("Train")]
        public ActionResult<string> Train(NetworkIdentity data)
        {
            NetworkFacade.TrainNetwork(data.NetworkID);

            return StatusCode(StatusCodes.Status202Accepted, "Network training started");
        }

        [HttpPost]
        [Route("Evaluate")]
        public ActionResult Evaluate(NetworkIdentity data)
        {
            NetworkFacade.EvaluateNetwork(data.NetworkID);

            return Ok();
        }

        [HttpGet]
        [Route("CurrentStatus")]
        public ActionResult<NetworkInfo> CurrentStatus([FromQuery] Guid networkID)
        {
            var status = NetworkFacade.NetworkCurrentStatus(networkID);

            return Ok(status);
        }

        [HttpGet]
        [Route("All")]
        public ActionResult<List<NetworkInfo>>? All()
        {
            try
            {
                return Ok(NetworkFacade.NetworkStatusAll());
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex);
            }
        }

        [HttpPost]
        [Route("Stop")]
        public void Stop(NetworkIdentity data)
        {
            NetworkFacade.StopNetwork(data.NetworkID);
        }

        [HttpPost]
        [Route("Remove")]
        public void Remove(NetworkIdentity data)
        {
            NetworkFacade.RemoveNetwork(data.NetworkID);
        }
    }

    public class NetworkIdentity
    {
        public Guid NetworkID { get; set; }
    }
}