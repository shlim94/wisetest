package wise.querysetting.dbms;

public class NETEZZASetting {

	public NETEZZASetting(){}
	public String vbCrLf = "\r\n";
	public String DsDsViewOrderByRandomClause()
	{
		String sOrderBy = "";

		sOrderBy = "ORDER BY SYS_GUID()";

		return sOrderBy;
	}
	
	public String ConvertFileNm(String aFileNm)
	{
		return "[" + aFileNm + "]";
	}
	
	public String FilterQuery(String aTblNm, String aCaptionColNm, String aKeyColNm, String aSortType)
	{
		String sQuery = "";

		sQuery = sQuery + vbCrLf + "SELECT cast(" + aKeyColNm + " as NVARCHAR(4000)) \"KEY_VALUE\" , cast(" + aCaptionColNm + " as NVARCHAR(4000)) \"CAPTION_VALUE\"";
		sQuery = sQuery + vbCrLf + "FROM   " + aTblNm;
		sQuery = sQuery + vbCrLf + "GROUP BY " + aKeyColNm + "," + aCaptionColNm;
		sQuery = sQuery + vbCrLf + "ORDER BY  \"KEY_VALUE\"" + aSortType;

		return sQuery;

	}
	
	public String TblAliasNm(String aDimUniNm)
	{
		String sAliasNm = "";

		sAliasNm = aDimUniNm.replace("[", "").replace("]", "");

		return sAliasNm;

	}
	
	public String ColumnAliasNm(String aColumnNm)
	{
		String sAliasNm = "";

		sAliasNm = "\"" + aColumnNm + "\"";

		return sAliasNm;

	}
}
