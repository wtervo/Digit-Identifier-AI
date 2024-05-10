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
        public ActionResult<string> Train(StartOperationData data)
        {
            NetworkFacade.TrainNetwork(data.NetworkID);

            Response.StatusCode = StatusCodes.Status202Accepted;
            return "Network training started";
        }

        [HttpPost]
        [Route("Evaluate")]
        public ActionResult Evaluate(StartOperationData data)
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
            return Ok(NetworkFacade.NetworkStatusAll());
        }

        [HttpPost]
        [Route("Remove")]
        public void Remove(StartOperationData data)
        {
            NetworkFacade.RemoveNetwork(data.NetworkID);
        }
    }

    public class StartOperationData
    {
        public Guid NetworkID { get; set; }
    }
}