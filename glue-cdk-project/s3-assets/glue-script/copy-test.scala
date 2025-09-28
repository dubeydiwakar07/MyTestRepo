import com.amazonaws.services.glue.GlueContext
import com.amazonaws.services.glue.util.Job
import org.apache.spark.SparkContext
import org.apache.spark.sql.DataFrame
import com.amazonaws.services.glue.util.GlueArgParser

object GlueApp {
  def main(sysArgs: Array[String]) {
    val args = GlueArgParser.getResolvedOptions(sysArgs, Seq("JOB_NAME").toArray)
    val sc = new SparkContext()
    val glueContext = new GlueContext(sc)
    val spark = glueContext.getSparkSession
    Job.init(args("JOB_NAME"), glueContext, args)

    val sourcePath = "s3://diw-test-bucket1/inbound/test.txt"
    val destinationPath = "s3://diw-test-bucket1/outbound/test.txt"

    val df: DataFrame = spark.read.text(sourcePath)
    df.write.mode("overwrite").text(destinationPath)

    Job.commit()
  }
}