package com.wise.ds.repository.dataset.jdbc;

public class TERADATAConnector extends AbstractDataBaseConnector {

    @Override
    public void init() {
        this.url = "jdbc:teradata://" + this.dataSetMaster.getDatabaseIp();
        this.url += "/database=" + this.dataSetMaster.getDatabaseName() + ",CHARSET=UTF8";
        this.user = this.dataSetMaster.getDatabaseUser();
        this.password = this.dataSetMaster.getDatabasePassword();
    }

    @Override
    public String getDriver() {
        return this.driver;
    }

    @Override
    public void setUrl(String url) {
        this.url = url;
    }

    @Override
    public String getUrl() {
        return this.url;
    }

    @Override
    public void setUser(String user) {
        this.user = user;
    }

    @Override
    public String getUser() {
        return this.user;
    }

    @Override
    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String toString() {
        return "TeraDataConnectionInformation [driver=" + driver + ", url=" + url + ", user=" + user + ", password=" + password + "]";
    }

}
