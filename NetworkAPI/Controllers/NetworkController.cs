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
        private NetworkFacade? NetworkFacade { get; set; } 

        // TODO: Implement network GUIDs to controller and all other levels

        [HttpPost]
        [Route("InitializeNetwork")]
        public ActionResult<Guid> InitializeNetwork(NetworkParameters parameters)
        {
            NetworkFacade = new NetworkFacade(parameters);

            Response.StatusCode = StatusCodes.Status201Created;
            return NetworkFacade.NetworkID;
        }

        [HttpPost]
        [Route("TrainNetwork")]
        public ActionResult<string> TrainNetwork()
        {
            CheckIfNetworkInitialized();
            NetworkFacade?.TrainNetwork();

            Response.StatusCode = StatusCodes.Status202Accepted;
            return "Network training started";
        }

        [HttpPost]
        [Route("EvaluateNetwork")]
        public ActionResult EvaluateNetwork()
        {
            CheckIfNetworkInitialized();
            NetworkFacade?.EvaluateNetwork();

            return Ok();
        }

        [HttpGet]
        [Route("NetworkCurrentStatus")]
        public ActionResult NetworkCurrentStatus()
        {
            CheckIfNetworkInitialized();
            var status = NetworkFacade?.NetworkCurrentStatus();

            return Ok(status);
        }

        private void CheckIfNetworkInitialized() 
        {
            if (NetworkFacade == null)
            {
                throw new Exception("Network is yet to be initialized. Pass network parameters before attempting any operations with the network.");
            }
        }
    }
}