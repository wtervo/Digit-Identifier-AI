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
            try
            {
                var networkID = NetworkFacade.AddNetwork(parameters);

                Response.StatusCode = StatusCodes.Status201Created;
                return networkID;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        [Route("Train")]
        public ActionResult<string> Train(NetworkIdentity data)
        {
            try
            {
                NetworkFacade.TrainNetwork(data.NetworkID);

                return StatusCode(StatusCodes.Status202Accepted, "Network training started");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        [Route("Evaluate")]
        public ActionResult<string> Evaluate(NetworkIdentity data)
        {
            try
            {
                NetworkFacade.EvaluateNetwork(data.NetworkID);

                return Ok("Evaluation started");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        [Route("CurrentStatus")]
        public ActionResult<NetworkInfo> CurrentStatus([FromQuery] Guid networkID)
        {
            try
            {
                var status = NetworkFacade.NetworkCurrentStatus(networkID);

                return Ok(status);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        [Route("All")]
        public ActionResult<List<NetworkInfo>>? All()
        {
            try
            {
                return Ok(NetworkFacade.NetworkStatusAll());
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        [Route("Stop")]
        public ActionResult<string> Stop(NetworkIdentity data)
        {
            try
            {
                NetworkFacade.StopNetwork(data.NetworkID);

                return Ok("Network stopped");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        [Route("Remove")]
        public ActionResult<string> Remove(NetworkIdentity data)
        {
            try
            {
                NetworkFacade.RemoveNetwork(data.NetworkID);

                return Ok("Network removed");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }

    public class NetworkIdentity
    {
        public Guid NetworkID { get; set; }
    }
}